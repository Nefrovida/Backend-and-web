import { Prisma } from '@prisma/client';
import { encryptDeterministic, decrypt } from '../util/encryption.util';

type EncryptionConfig = {
    [model: string]: string[]; // Model name -> Array of field names to encrypt
};

/**
 * Extension to encrypt data on save and decrypt on read.
 * @param config Configuration object specifying which fields to encrypt for which models.
 */
export const prismaEncryptionExtension = (config: EncryptionConfig) => {
    return Prisma.defineExtension({
        name: 'prisma-encryption',
        query: {
            $allModels: {
                async $allOperations({ model, operation, args, query }) {
                    if (!model || !config[model]) {
                        return await query(args);
                    }

                    const fieldsToEncrypt = config[model];

                    // --- Encryption (Write Operations) ---
                    if (['create', 'update', 'upsert', 'createMany'].includes(operation)) {
                        encryptParams(args, fieldsToEncrypt);
                    }

                    // --- Encryption (Where Clauses - for Search) ---
                    if (args && (args as any).where) {
                        encryptObject((args as any).where, fieldsToEncrypt);
                    }

                    // --- Execute Query ---
                    const result = await query(args);

                    // --- Decryption (Read Operations) ---
                    if (
                        ['findUnique', 'findFirst', 'findMany', 'create', 'update', 'upsert'].includes(operation) &&
                        result
                    ) {
                        decryptData(result, fieldsToEncrypt);
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

    // TODO: Handle nested writes if necessary, though complex.
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
const decryptData = (data: any, fields: string[]) => {
    if (!data) return;

    if (Array.isArray(data)) {
        data.forEach((item) => decryptObject(item, fields));
    } else {
        decryptObject(data, fields);
    }
};

// Helper to decrypt a single object's fields
const decryptObject = (obj: any, fields: string[]) => {
    if (!obj) return;
    fields.forEach((field) => {
        if (obj[field] && typeof obj[field] === 'string') {
            obj[field] = decrypt(obj[field]);
        }
    });
};
