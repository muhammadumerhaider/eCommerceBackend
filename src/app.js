import express from 'express';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';

const app = express();
connectDB();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  
  max: 100,
  message: "Too many requests from this IP, please try again later."
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
}));
app.use(helmet());

app.use('/api/products', productRoutes);
app.use('/api/user', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);

app.listen(process.env.PORT, function () {
  console.log('Server is running...');
});
