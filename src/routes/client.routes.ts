import { Router, type Router as RouterType } from "express";
import { showClientPage, registerClient } from "../controllers/client.controller";

const router : RouterType = Router();

router.get("/register", showClientPage);
router.post("/register", registerClient);

export default router;