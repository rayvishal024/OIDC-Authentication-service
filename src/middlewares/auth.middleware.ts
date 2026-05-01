import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export const sessionMiddleware = (req: Request,res: Response,next: NextFunction) => {
     try {
          const token = req.cookies?.token;

          if (!token) return next();

          const decoded = verifyToken(token);

          if (decoded) {
               (req as any).user = decoded;
          }

          next();
     } catch {
          next();
     }
};

export const bearerMiddleware = (req: Request,res: Response,next: NextFunction) => {
     try {
          const authHeader = req.headers.authorization;

          if (!authHeader || !authHeader.startsWith("Bearer ")) {
               return res.status(401).json({ error: "Missing or invalid Authorization header" });
          }

          const token = authHeader.split(" ")[1];

          if (!token) {
               return res.status(401).json({ error: "Token missing" });
          }

          const decoded = verifyToken(token);

          if (!decoded) {
               return res.status(401).json({ error: "Invalid token" });
          }

          (req as any).user = decoded;

          next();
     } catch (err) {
          return res.status(401).json({ error: "Invalid or expired token" });
     }
};