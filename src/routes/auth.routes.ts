import { Router, type Router as RouterType } from "express";
import { showRegister, register, showLogin, login } from "../controllers/auth.controller";

const router: RouterType = Router();

// register
router.get("/register", showRegister);
router.post("/register", register);

// login
router.get("/login", showLogin);
router.post("/login", login);

export default router;