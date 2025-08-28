import express from "express";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cartRoutes from "./routes/cartRoutes.js"
import orderRoutes from "./routes/orderRoutes.js";
const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);

app.listen(process.env.PORT, function () {
  console.log("Server is running...");
});
