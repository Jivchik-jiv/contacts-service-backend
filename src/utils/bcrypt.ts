import * as bcrypt from 'bcrypt';
const SaltRounds = 10;

export const hashPassword = (rawPassword: string): string => {
  const SALT = bcrypt.genSaltSync(SaltRounds);
  return bcrypt.hashSync(rawPassword, SALT);
};
