import Cart from "../models/cart.js";
import Product from "../models/Product.js";

export const addToCart = async (req, res) => {
  try {
    const { userId, items, totalPrice } = req.body;

    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ message: "Kindly fill all the fields." });
    }

    for (const item of items) {
      if (!item.productId || !item.quantity || !item.price) {
        return res.status(400).json({ message: "Invalid item data", item });
      }
    }

    let cart = await Cart.findOne({ userId, isOrdered: false });

    if (!cart) {
      cart = new Cart({
        userId,
        items,
        totalPrice,
      });
    } else {
      items.forEach((item) => {
        const existingItem = cart.items.find(
          (i) => i.productId.toString() === item.productId
        );

        if (existingItem) {
          existingItem.quantity += item.quantity;
          existingItem.price = item.price;
        } else {
          cart.items.push(item);
        }
      });

      cart.totalPrice = cart.items.reduce(
        (sum, i) => sum + i.quantity * i.price,
        0
      );
    }

    const savedCart = await cart.save();
    res.status(200).json({ message: "Item added to Cart Successfully.", cart: savedCart });
  } catch (error) {
    console.error("Error in addToCart:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const viewCart = async(req,res)=>{
    const {userId}=req.body

    if(!userId){
        return res.json("User ID is required")
    }

        const cart = await Cart.findOne({userId})
        return res.json(cart)

}

export const updateCart = async (req, res) => {
  try {    
    const { userId, items } = req.body;

    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ message: "Kindly fill all the fields." });
    }

    let cart = await Cart.findOne({ userId, isOrdered: false });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    items.forEach((item) => {
      const cartItem = cart.items.find(
        (i) => i.productId.toString() === item.productId
      );

      if (cartItem) {
        if (item.quantity > 0) {
          cartItem.quantity = item.quantity;
          cartItem.price = item.price;
        } else {
          cart.items = cart.items.filter(
            (i) => i.productId.toString() !== item.productId
          );
        }
      } else {
        if (item.quantity > 0) {
          cart.items.push(item);
        }
      }
    });

    cart.totalPrice = cart.items.reduce(
      (sum, i) => sum + i.quantity * i.price,
      0
    );

    const updatedCart = await cart.save();
    res.status(200).json({ message: "Cart updated successfully", cart: updatedCart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    console.log('req.body ',req.body);
    const { userId, items } = req.body;

    // const userId = req.user.id;
    const { productId } = req.params;
    console.log('userId ',userId);
    
    let cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();

    res.json({ message: "Item removed from cart", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    res.json({ message: "Cart cleared", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};




