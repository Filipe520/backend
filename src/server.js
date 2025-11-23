import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = ["http://localhost:3000"];

// Configure as opções do CORS
const corsOptions = {
  origin: (origin, callback) => {
    // Permitir acesso se a origem for permitida ou se for uma requisição sem origem (como Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true, // Se você usa cookies/sessions
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
};

// <--- USE O MIDDLEWARE CORS AQUI, NO INÍCIO --->
app.use(cors(corsOptions));

// Garante que o express use o parser JSON
app.use(express.json());

// Rota de teste e autenticação
app.use("/api/auth", authRoutes);

export default app;
