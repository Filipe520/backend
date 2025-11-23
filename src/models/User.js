import mongoose from "mongoose";

// Schema
const UserSchema = new mongoose.Schema({
  userName: String,
  fullName: String,
  email: { type: String, unique: true },
  password: String,
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
