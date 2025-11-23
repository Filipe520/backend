import { connectDB } from "../lib/mongodb.js";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
import Cors from "cors";

dotenv.config();

const cors = Cors({
  origin: "*",
  methods: ["POST", "GET"],
});

// Helper para CORS funcionar no Vercel
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

// FUNÇÃO PRINCIPAL
export default async function handler(req, res) {
  await runMiddleware(req, res, cors);
  await connectDB();

  if (req.method === "POST" && req.query.action === "register") {
    const { userName, fullName, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "Email já cadastrado" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      userName,
      fullName,
      email,
      password: hash,
    });

    return res.json({ msg: "Registrado com sucesso", user });
  }

  if (req.method === "POST" && req.query.action === "login") {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Usuário não encontrado" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Senha incorreta" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({ msg: "Login efetuado com sucesso", token, user });
  }

  return res.status(404).json({ msg: "Rota não encontrada" });
}
