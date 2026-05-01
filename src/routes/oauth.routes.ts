import { Router, type Router as RouterType } from "express";
import { authorize, token, userInfo, jwks, discovery } from "../controllers/oauth.controller";
import { sessionMiddleware, bearerMiddleware } from "../middlewares/auth.middleware";

const router : RouterType = Router();

router.get("/authorize", sessionMiddleware, authorize);
router.post("/token", token);
router.get("/userinfo", bearerMiddleware, userInfo);
router.get("/.well-known/jwks.json", jwks);
router.get("/.well-known/openid-configuration",discovery);

export default router;