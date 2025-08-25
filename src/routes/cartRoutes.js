import express from "express";
import {
  addToCart,
  viewCart,
  updateCart,
  removeFromCart,
} from "../controllers/cartController.js";
// import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", addToCart);
router.get("/", viewCart);
router.put("/:userID", updateCart);
router.delete("/:userID", removeFromCart);

export default router;
