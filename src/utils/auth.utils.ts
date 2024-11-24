import bcrypt from "bcrypt";
import e from "express";

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const checkPassword = async (
  enteredPassword: string,
  hashPassword: string
) => {
  return await bcrypt.compare(enteredPassword, hashPassword);
};
