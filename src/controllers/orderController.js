import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

export const placeOrder=async(req,res)=>{
    try {
        
        const { userId, shippingAddress } = req.body;
    
        const cart = await Cart.findOne({ userId });
        console.log('cart ',cart);
        
        if (!cart || cart.items.length === 0) {
          return res.status(400).json({ message: "Cart is empty" });
        }
        
        const newOrder = new Order({
          userId,
          items: cart.items,
          totalPrice: cart.totalPrice,
          shippingAddress,
        });
    
        await newOrder.save();
    
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();
    
        res.status(201).json({message:"Order Placed Successfully.", newOrder});
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

export const viewOrder = async(req,res)=>{
    try{
        console.log('req ',req);
        
        const userId = req.params.userID;

        if(!userId){
            return res.json("User ID is required")
        }
    
            const order = await Order.findOne({userId})
            return res.json(order)
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

export const viewAllOrders = async(req,res)=>{
    try{
        
            const order = await Order.find()
            return res.json(order)
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

export const updateOrderStatus = async (req, res) => {
    try {        
      const { status } = req.body;
      const userId = req.params.userID;
      
      const order = await Order.findOne({userId});
  
      if (!order) return res.status(404).json({ message: "Order not found" });
  
      order.status = status;
      await order.save();
  
      res.json({message:"Order Status Updated Successfully.", order});
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const cancelOrder = async (req, res) => {
    try {        
      const { status } = req.body;
      const userId = req.params.userID;
      
      const order = await Order.findOne({userId});
  
      if (!order) return res.status(404).json({ message: "Order not found" });
    
      if(order.status!="pending"){
        return res.status(404).json({ message: "Order cannot be Cancelled now." });
      }
      order.status = "cancelled";
      await order.save();
  
      res.json({message:"Order Cancelled Successfully.", order});
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  