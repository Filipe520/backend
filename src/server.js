import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).json({});
  }

  next();
});

app.use(express.json());

app.use("/api/auth", authRoutes);

// Ser fosse roda no localhost
// app.listen(5000, () => console.log("Servidor rodando na porta 5000"));
// Ser for roda no Vercel, Exporta para Vercel
export default app;
