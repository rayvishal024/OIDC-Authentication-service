import { Router, type Router as RouterType } from "express";
import { showRegister, register, showLogin, login } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router: RouterType = Router();

// register
router.get("/register", showRegister);
router.post("/register", register);

// login
router.get("/login", showLogin);
router.post("/login", login);


router.get("/profile", authMiddleware, (req, res) => {
     res.json({
          message: "Protected route accessed ",
          user: (req as any).user,
     });
});

export default router;