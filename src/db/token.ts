import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const TokenModel = mongoose.model("Token", TokenSchema);

export const getToken = () => TokenModel.findOne();
export const createToken = (values: Record<string, any>) =>
  new TokenModel(values).save().then((doc) => doc.toObject());
export const deleteAllTokens = () => TokenModel.deleteMany();
