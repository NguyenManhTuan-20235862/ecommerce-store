import express from "express";
import { getConfig, updateConfig } from "../controllers/siteConfigController.js";
import { adminRoute, protectedRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getConfig);
router.put("/", protectedRoute, adminRoute, updateConfig);

export default router;
