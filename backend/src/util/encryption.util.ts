import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
// Ensure the key is 32 bytes. In production, this should be strictly enforced.
// For development, we can pad or truncate if necessary, but it's better to fail if invalid.
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '';
const IV_LENGTH = 16; // For AES, this is always 16

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
  console.warn(
    'WARNING: ENCRYPTION_KEY is missing or not 32 characters long. Encryption will fail or be insecure.'
  );
}

export const encrypt = (text: string): string => {
  if (!text) return text;
  if (!ENCRYPTION_KEY) throw new Error('ENCRYPTION_KEY is not defined');

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  // Return IV:EncryptedText
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

export const encryptDeterministic = (text: string): string => {
  if (!text) return text;
  if (!ENCRYPTION_KEY) throw new Error('ENCRYPTION_KEY is not defined');

  // Create IV based on the text itself so it's always the same for the same text
  const iv = crypto.createHmac('sha256', ENCRYPTION_KEY).update(text).digest().subarray(0, IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  // Return IV:EncryptedText
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

export const decrypt = (text: string): string => {
  if (!text) return text;
  if (!ENCRYPTION_KEY) throw new Error('ENCRYPTION_KEY is not defined');

  const textParts = text.split(':');
  if (textParts.length !== 2) {
    // Not in the expected format (IV:Encrypted), maybe it's already plain text or legacy data?
    // Returning original text to be safe, or could throw error.
    return text;
  }

  const iv = Buffer.from(textParts.shift()!, 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');

  try {
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    // Decryption failed (wrong key, corrupted data, etc.)
    console.error('Decryption failed:', error);
    return text; // Return original text if decryption fails
  }
};
