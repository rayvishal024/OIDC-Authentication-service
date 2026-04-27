import fs from "fs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

const privateKey = fs.readFileSync(env.JWT_PRIVATE_KEY, "utf-8");
const publicKey = fs.readFileSync(env.JWT_PUBLIC_KEY, "utf-8");

export const signToken = (payload: object) => {
     return jwt.sign(payload, privateKey, {
          algorithm: "RS256",
          expiresIn: "15m",
     });
};

export const verifyToken = (token: string) => {
     return jwt.verify(token, publicKey, {
          algorithms: ["RS256"],
     });
};