import argon2 from "argon2";

export const hashPassword = async (plain: string) => {
  return argon2.hash(plain);
};

export const verifyPassword = (hash: string, plain: string) => {
  return argon2.verify(hash, plain);
};
