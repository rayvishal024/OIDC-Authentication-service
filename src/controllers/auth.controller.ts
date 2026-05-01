import { Request, Response } from "express";
import * as authService from "../services/auth.service";

// register
export const register = async (req: Request, res: Response) => {
     try {
          const user = await authService.registerUser(req.body);
          res.send("User registered successfully");
     } catch (error: any) {
          res.status(400).send(error.message);
     }
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
          console.log(redirect)
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