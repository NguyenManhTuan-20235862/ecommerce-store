import express from "express";
import {
  createMember,
  deleteMember,
  getAllMembers,
  getMembers,
  updateMember,
} from "../controllers/teamController.js";
import { adminRoute, protectedRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getMembers);

router.get("/admin", protectedRoute, adminRoute, getAllMembers);
router.post("/", protectedRoute, adminRoute, createMember);
router.put("/:id", protectedRoute, adminRoute, updateMember);
router.delete("/:id", protectedRoute, adminRoute, deleteMember);

export default router;
