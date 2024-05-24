import crypto from "crypto";

const SECRET = "AbdouDzz2024";

export const random = () => crypto.randomBytes(128).toString("base64");

export const authentication = (password: string, salt: string) =>
  crypto
    .createHmac("sha256", [password, salt].join("/"))
    .update(SECRET)
    .digest("hex");
