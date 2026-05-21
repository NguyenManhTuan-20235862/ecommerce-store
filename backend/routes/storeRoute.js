import express from "express";
import {
  createStore,
  deleteStore,
  getAllStores,
  getStores,
  updateStore,
} from "../controllers/storeController.js";
import { adminRoute, protectedRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getStores);

router.get("/admin", protectedRoute, adminRoute, getAllStores);
router.post("/", protectedRoute, adminRoute, createStore);
router.put("/:id", protectedRoute, adminRoute, updateStore);
router.delete("/:id", protectedRoute, adminRoute, deleteStore);

export default router;
