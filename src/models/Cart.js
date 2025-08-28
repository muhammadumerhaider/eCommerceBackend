import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
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
        required: true,
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
  isOrdered: {
    type: Boolean,
    default: false,
  },
});

cartSchema.pre("save", function (next) {
  this.totalPrice = this.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  next();
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
