import { randomBytes, randomInt, createHash } from 'crypto';
import { hash, genSalt } from 'bcryptjs';

export const generateVerificationCode = (): string => {
  const code = randomInt(100000, 999999).toString();
  return code;
};

export const generateKey = (): string => {
  const hash = createHash('sha256');
  hash.update(randomBytes(64));
  return hash.digest('hex');
};

export const hashString = async (val: string): Promise<string> => {
  const salt = await genSalt();
  const hashedString = await hash(val.toString(), salt);

  return hashedString;
};
