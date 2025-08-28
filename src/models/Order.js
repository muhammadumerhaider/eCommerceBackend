import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    userId: {
        type: String,
        ref: "User",
        required: true,
      },
      items: [
        {
          productId: {
            type: String,
            ref: "Product",
            required: true,
          },
          quantity: {
            type: Number,
            // required: true,
            min: 1,
          },
          price: {
            type: Number,
            // required: true,
          },
        },
      ],
      totalPrice: {
        type: Number,
        default : 0
      },
      shippingAddress: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        default: "pending",
      },
      paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
      },
});

const Order = mongoose.model("Order",orderSchema);
export default Order;