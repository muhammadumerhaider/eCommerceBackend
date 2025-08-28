import express from "express";
import {
    placeOrder,
    viewOrder,
    viewAllOrders,
    updateOrderStatus,
    cancelOrder
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/:userID", protect, viewOrder);
router.get("/", adminOnly, viewAllOrders);
router.put("/:userID", adminOnly, updateOrderStatus);
router.delete("/:userID", protect, cancelOrder);

export default router;