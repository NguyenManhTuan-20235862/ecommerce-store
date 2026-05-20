import express from "express";
import { getTiers, updateTiers } from "../controllers/saleConfigController.js";
import { adminRoute, protectedRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getTiers);
router.put("/tiers", protectedRoute, adminRoute, updateTiers);

export default router;
