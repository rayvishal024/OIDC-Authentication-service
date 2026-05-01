import fs from "fs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

const privateKey = Buffer.from(
     env.JWT_PRIVATE_KEY_BASE64,
     "base64"
).toString("utf-8");

const publicKey = Buffer.from(
     env.JWT_PUBLIC_KEY_BASE64,
     "base64"
).toString("utf-8");

export const signToken = (payload: object) => {
     return jwt.sign(payload, privateKey, {
          algorithm: "RS256",
          expiresIn: "15m",
          keyid: "my-key-1",
     });
};

export const verifyToken = (token: string) => {
     return jwt.verify(token, publicKey, {
          algorithms: ["RS256"],
     });
};