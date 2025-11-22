import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

// Ser fosse roda no localhost
// app.listen(5000, () => console.log("Servidor rodando na porta 5000"));
// Ser for roda no Vercel, Exporta para Vercel
export default app;
