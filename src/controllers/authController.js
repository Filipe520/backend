import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  console.log(req);
  try {
    const { userName, fullName, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: "Email já cadastrado" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      userName,
      fullName,
      email,
      password: hashed,
    });

    return res.json({ msg: "Registrado com sucesso", user });
  } catch (err) {
    res.status(500).json({ msg: "Erro interno" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Usuário não encontrado" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Senha incorreta" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({ msg: "Logado", token, user });
  } catch (err) {
    res.status(500).json({ msg: "Erro interno" });
  }
};
