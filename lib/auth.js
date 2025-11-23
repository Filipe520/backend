import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

export const registerUser = async ({ userName, fullName, email, password }) => {
  const exists = await User.findOne({ email });
  if (exists) throw new Error("Email já cadastrado");

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ userName, fullName, email, password: hash });
  return user;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Usuário não encontrado");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Senha incorreta");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return { user, token };
};
