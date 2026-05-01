import { Request, Response } from "express";
import * as authService from "../services/auth.service";

// show register controller
export const showRegister = (req: Request, res: Response) => {
     res.render("register");
};

// register
export const register = async (req: Request, res: Response) => {
     try {
          const user = await authService.registerUser(req.body);
          res.send("User registered successfully");
     } catch (error: any) {
          res.status(400).send(error.message);
     }
};

// show login
export const showLogin = (req : Request, res : Response) => {
     const redirect = req.query.redirect || "";
     res.render("login", { redirect });
};

// login 
export const login = async (req: Request, res: Response) => {
     try {
          const { user, token } = await authService.loginUser(req.body);

          // set cookies
          res.cookie("token", token, {
               httpOnly: true,
               sameSite: "lax",
               secure: false, 
          });
          
          // redirect 
          const redirect = req.body.redirect;
          if (redirect) {
               const decoded = decodeURIComponent(redirect);
               return res.redirect(decoded);
          }

          // success login
          return res.json({
               message: "Login successful",
          });

     } catch (err: any) {
          res.status(400).send(err.message);
     }
};