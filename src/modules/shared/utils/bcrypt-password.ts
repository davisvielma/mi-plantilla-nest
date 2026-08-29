import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string, salt = 10) => {
  return await bcrypt.hash(password, salt);
};

export const comparePasswords = async (
  password: string,
  passwordHash: string,
) => {
  return await bcrypt.compare(password, passwordHash);
};
