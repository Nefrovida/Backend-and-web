import { Prisma } from '@prisma/client';
import { encryptDeterministic, decrypt } from '../util/encryption.util';

type EncryptionConfig = {
    [model: string]: string[]; // Model name -> Array of field names to encrypt
};

type RelationConfig = {
    [model: string]: { [field: string]: string }; // Model -> Field -> Target Model
};

/**
 * Extension to encrypt data on save and decrypt on read.
 * @param config Configuration object specifying which fields to encrypt for which models.
 * @param relationConfig Configuration object specifying relation mappings for recursive decryption.
 */
export const prismaEncryptionExtension = (config: EncryptionConfig, relationConfig: RelationConfig = {}) => {
    return Prisma.defineExtension({
        name: 'prisma-encryption',
        query: {
            $allModels: {
                async $allOperations({ model, operation, args, query }) {
                    // 1. Handle Encryption (Write Operations)
                    if (model && config[model]) {
                        const fieldsToEncrypt = config[model];

                        if (['create', 'update', 'upsert', 'createMany'].includes(operation)) {
                            encryptParams(args, fieldsToEncrypt);
                        }

                        // Encryption for Where Clauses (Search)
                        if (args && (args as any).where) {
                            encryptObject((args as any).where, fieldsToEncrypt);
                        }
                    }

                    // 2. Execute Query
                    const result = await query(args);

                    // 3. Handle Decryption (Read Operations)
                    // We attempt decryption if we have a result and it's a read operation.
                    // Even if the top-level model isn't configured, we might need to decrypt nested relations.
                    // However, usually we start from a configured model or we traverse.
                    // If model is not in config, we might still want to check for nested relations?
                    // Yes, e.g. finding a Patient (not encrypted) that includes Notes (encrypted).

                    if (
                        ['findUnique', 'findFirst', 'findMany', 'create', 'update', 'upsert'].includes(operation) &&
                        result
                    ) {
                        if (model) {
                            decryptData(result, model, config, relationConfig);
                        }
                    }

                    return result;
                },
            },
        },
    });
};

// Helper to recursively encrypt fields in params
const encryptParams = (args: any, fields: string[]) => {
    if (!args) return;

    // Handle 'data' field (common in create/update)
    if (args.data) {
        if (Array.isArray(args.data)) {
            // createMany
            args.data.forEach((item: any) => encryptObject(item, fields));
        } else {
            encryptObject(args.data, fields);
        }
    }

    // Handle 'create' and 'update' inside upsert
    if (args.create) encryptObject(args.create, fields);
    if (args.update) encryptObject(args.update, fields);
};

// Helper to encrypt a single object's fields
const encryptObject = (obj: any, fields: string[]) => {
    if (!obj) return;
    fields.forEach((field) => {
        if (obj[field] && typeof obj[field] === 'string') {
            obj[field] = encryptDeterministic(obj[field]);
        }
    });
};

// Helper to recursively decrypt fields in result
const decryptData = (
    data: any,
    model: string,
    config: EncryptionConfig,
    relationConfig: RelationConfig
) => {
    if (!data) return;

    if (Array.isArray(data)) {
        data.forEach((item) => decryptObject(item, model, config, relationConfig));
    } else {
        decryptObject(data, model, config, relationConfig);
    }
};

// Helper to decrypt a single object's fields and recurse
const decryptObject = (
    obj: any,
    model: string,
    config: EncryptionConfig,
    relationConfig: RelationConfig
) => {
    if (!obj || typeof obj !== 'object') return;

    // 1. Decrypt fields for the current model
    const fields = config[model];
    if (fields) {
        fields.forEach((field) => {
            if (obj[field] && typeof obj[field] === 'string') {
                obj[field] = decrypt(obj[field]);
            }
        });
    }

    // 2. Recurse into relations
    // We iterate over keys of the object to find relations
    Object.keys(obj).forEach((key) => {
        let targetModel: string | undefined;

        // Check explicit relation config first
        if (relationConfig[model] && relationConfig[model][key]) {
            targetModel = relationConfig[model][key];
        }
        // Fallback: Check if key matches a configured model name
        else if (config[key]) {
            targetModel = key;
        }

        if (targetModel) {
            decryptData(obj[key], targetModel, config, relationConfig);
        }
    });
};
