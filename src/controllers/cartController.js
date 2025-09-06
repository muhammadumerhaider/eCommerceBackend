import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const addToCart = async (req, res) => {
  try {
    const { userId, items } = req.body;

    let cart = await Cart.findOne({ userId, isOrdered: false });

    const newItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product)
        return res.status(404).json({ message: 'Product not found' });

      newItems.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    if (cart) {
      newItems.forEach((newItem) => {
        const existing = cart.items.find(
          (item) => item.productId.toString() === newItem.productId.toString()
        );
        if (existing) {
          existing.quantity += newItem.quantity;
        } else {
          cart.items.push(newItem);
        }
      });
    } else {
      cart = new Cart({ userId, items: newItems });
    }

    await cart.save();
    res.status(200).json({
      message: 'Item added to Cart Sucessfully.',
      cart,
    });
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const viewCart = async (req, res) => {
  const userId = req.params.userID;

  if (!userId) {
    return res.json('User ID is required');
  }

  const cart = await Cart.findOne({ userId });
  return res.json(cart);
};

export const updateCart = async (req, res) => {
  try {
    const { userId, items } = req.body;

    let cart = await Cart.findOne({ userId, isOrdered: false });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    // Loop over items sent in request
    items.forEach((updateItem) => {
      const existing = cart.items.find(
        (i) => i.productId.toString() === updateItem.productId.toString()
      );
      if (existing) {
        existing.quantity = updateItem.quantity; // update quantity
      }
    });

    await cart.save(); // totalPrice auto-calculated
    res.status(200).json({ message: 'Cart Updated Successfully.', cart });
  } catch (err) {
    console.error('Update cart error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    console.log('req.params ', req.params);
    console.log('req.body ', req.body);

    const { userID, productID } = req.params;
    console.log('userID ', userID);

    let cart = await Cart.findOne({ userId: userID });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    // check if product exists in cart
    const itemExists = cart.items.some(
      (item) => item.productId.toString() === productID
    );
    if (!itemExists) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // remove the product from items array
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productID
    );

    // recalculate total price
    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();
    res.status(200).json({ message: 'Product removed from cart', cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error removing product', error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userID = req.params.userID;
    console.log('userid ', userID);

    let cart = await Cart.findOne({ userId: userID });
    console.log('cart ', cart);

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    res.json({ message: 'Cart cleared', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
