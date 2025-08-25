import express from "express";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cartRoutes from "./routes/cartRoutes.js"

const app = express();
connectDB();

app.use(bodyParser.json());

app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);

app.listen(process.env.PORT, function () {
  console.log("Server is running...");
});
