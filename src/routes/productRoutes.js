import express from 'express';
import {
  addProduct,
  viewProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = express.Router();

router.post('/', addProduct);
router.get('/', viewProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
