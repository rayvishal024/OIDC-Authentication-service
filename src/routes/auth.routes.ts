import { Router, type Router as RouterType } from "express";
import {  register, login } from "../controllers/auth.controller";

const router: RouterType = Router();

// register
router.post("/register", register);

// login
router.post("/login", login);


export default router;