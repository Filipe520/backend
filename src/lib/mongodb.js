import mongoose from "mongoose";

// Conexão Mongo (reutilizável)

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
};
