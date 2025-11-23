import dotenv from "dotenv";
import { connectDB } from "../lib/mongodb";
import { runMiddleware } from "../lib/corsMiddleware";
import cors from "../lib/corsMiddleware";
import { registerUser, loginUser } from "../lib/auth";

dotenv.config();

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);
  await connectDB();

  try {
    if (req.method === "POST" && req.query.action === "register") {
      const user = await registerUser(req.body);
      return res.json({ msg: "Registrado com sucesso", user });
    }

    if (req.method === "POST" && req.query.action === "login") {
      const { user, token } = await loginUser(req.body);
      return res.json({ msg: "Login efetuado com sucesso", user, token });
    }

    return res.status(404).json({ msg: "Rota não encontrada" });
  } catch (err) {
    return res.status(400).json({ msg: err.message });
  }
}
