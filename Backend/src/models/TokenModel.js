// Backend/src/models/TokenModel.js
import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  key:         { type: String, default: "kite_token", unique: true },
  accessToken: { type: String, required: true },
  updatedAt:   { type: Date, default: Date.now },
});

export const TokenModel = mongoose.model("KiteToken", tokenSchema);