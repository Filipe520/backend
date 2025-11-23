import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", UserSchema);

// Garante que a conexão só seja estabelecida uma vez
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("MongoDB conectado");
  } catch (err) {
    console.error("Erro ao conectar:", err);
  }
};

connectDB();

const register = async (req, res) => {
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

const login = async (req, res) => {
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

const router = express.Router();
router.post("/register", register);
router.post("/login", login);

const app = express();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Rota serverless final
app.use("/api/auth", router);

// NECESSÁRIO para Vercel funcionar
export const config = {
  api: { bodyParser: false },
};

export default (req, res) => app(req, res);
