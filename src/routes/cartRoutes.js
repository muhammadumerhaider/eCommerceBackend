import express from "express";
import {
  addToCart,
  viewCart,
  updateCart,
  removeFromCart,
  clearCart
} from "../controllers/cartController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addToCart);
router.get("/:userID", protect, viewCart);
router.put("/:userID", protect, updateCart);
router.delete("/:userID/:productID", protect, removeFromCart);
router.delete("/:userID", protect, clearCart);

export default router;
