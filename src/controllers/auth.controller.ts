import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export const showRegister = (req: Request, res: Response) => {
     res.render("register");
};

export const register = async (req: Request, res: Response) => {
     try {
          const user = await authService.registerUser(req.body);
          res.send("User registered successfully");
     } catch (error: any) {
          res.status(400).send(error.message);
     }
};

export const showLogin = (req : Request, res : Response) => {
     res.render("login");
};

export const login = async (req : Request, res : Response) => {
     try {
          const user = await authService.loginUser(req.body);
          res.send("Login successful");
     } catch (err: any) {
          res.status(400).send(err.message);
     }
};