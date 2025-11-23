import mongoose from "mongoose";

// Schema
const UserSchema = new mongoose.Schema({
  userName: String,
  fullName: String,
  email: { type: String, unique: true },
  password: String,
});
// Exportando função, para ser reutilizada em outro lugar no código
export const userSchema =
  mongoose.models.User || mongoose.model("User", UserSchema);
