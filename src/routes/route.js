import express from "express";
import Registration from "../models/registration.js"
import Product from "../models/product.js";
import Cart from "../models/cart.js";

const router=express.Router();


    // registration API's

router.post('/register',(req,res)=>{
    const{email,password,role} = req.body;

    if(!email || !password || !role){
        return res.json("Kindly fill out the fields.")
    }

    Registration.findOne({email:email}).then((exist)=>{
        if(exist){
            return res.json("Email already exists.")
        }

        const User = new Registration({email,password,role})
        User.save().then(()=>{
            return res.json("Registration Successful.")
        }).catch(()=>{
            return res.json("Registration Failed.")
        })

    }).catch((err)=>{
        return res.json(err)
    })

})

router.post('/signin',async (req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.json("Kindly fill out the fields.")
    }

    const User = await Registration.findOne({email:email,password:password});

    if(User){
        return res.json("Sign in Successful")
    }
    else{
        return res.json("Sign in Failed")
    }


})


    // product API's

router.post('/addProduct',(req,res)=>{
    const{name,description,price,imgURL,category} = req.body
    if(!name){
        return res.json("Kindly fill out Product name.")
    }

    const addedProduct = new Product({name,description,price,imgURL,category})
    addedProduct.save().then(()=>{
        return res.json("Product added successfully.")
    }).catch((err)=>{
        return res.json(err)
    })
})

router.get('/viewProduct',async (req,res)=>{
    const viewedProduct = await Product.find()
    res.json(viewedProduct)
})

router.put('/updateProduct/:id',async (req,res)=>{
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id,req.body)
    if(updatedProduct){
        updatedProduct.name = req.body.name
        updatedProduct.description = req.body.description
        updatedProduct.price = req.body.price
        updatedProduct.imgURL = req.body.imgURL
        updatedProduct.category = req.body.category
        return res.json(updatedProduct)
    }else{
        return res.json("Product not updated.")
    }
})

router.delete('/deleteProduct', async(req,res)=>{
    const{id} = req.body

    const deletedProduct = await Product.findByIdAndDelete(id)
    console.log('deletedProduct ',deletedProduct);
    if(deletedProduct){
        return res.json(`Product with name ${deletedProduct.name} deleted successfully.`)
    }else{
        return res.json("Product not deleted.")
    }
})


    // cart API's

router.post('/addToCart', async (req, res) => {
        try {
            const { userId, productId, quantity } = req.body;
    
            // Validate input
            if (!userId || !productId || !quantity) {
                return res.status(400).json({ message: 'User ID, Product ID, and quantity are required' });
            }
    
            // Check if product exists
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
    
            // Find user's cart
            let cart = await Cart.findOne({ userId });
    
            if (!cart) {
                // Create new cart if it doesn't exist
                cart = new Cart({
                    userId,
                    items: [{ productId, quantity, price: product.price }],
                    totalPrice: product.price * quantity
                });
            } else {
                // Check if product is already in the cart
                const existingItem = cart.items.find(item => item.productId.toString() === productId);
    
                if (existingItem) {
                    existingItem.quantity += quantity; // Update quantity
                    existingItem.price = product.price; // Update price
                } else {
                    cart.items.push({ productId, quantity, price: product.price }); // Add new item
                }
    
                // Recalculate total price
                cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
            }
    
            await cart.save(); // Save cart
            res.status(200).json({ message: 'Product added to cart successfully', cart });
    
        } catch (error) {
            console.error('Error adding product to cart:', error);
            res.status(500).json({ message: 'Server error' });
        }
});

router.post("/removeFromCart",async (req,res)=>{
    try{
        const {userId,productId}=req.body

        if(!userId || !productId){
            return res.json("User ID, Product ID are required")
        }
        const prod = await Product.findById(productId)
        if(!prod){
            return res.json("Product not found")
        }
        console.log('prod ',prod);
        const cart = await Cart.findOne({userId})
        console.log('cart ',cart);

        const productIndex = cart.items.findIndex((item)=>{
            return item.productId.toString() === productId
        })
    if (productIndex == -1) {
        return res.json("Product not found in cart")
    }
    if (cart.items[productIndex].quantity > 1) {
        cart.items[productIndex].quantity -= 1;  // for - btn
    } else {
        cart.items.splice(productIndex, 1);  // for delete btn for whole cart
    }

    await cart.save()
    res.json("Product removed from cart successfully.")

    }catch(err){
        return res.json("Error removing product to cart",err)
    }
});

router.get("/viewCart", async(req,res)=>{
    const {userId}=req.body

    if(!userId){
        return res.json("User ID is required")
    }

        const cart = await Cart.findOne({userId})
        return res.json(cart.items)

})

router.patch("/updateCart",async(req,res)=>{    // + button in Add to cart
    try{
        const {userId,productId}=req.body

        if(!userId || !productId){
            return res.json("User ID, Product ID are required")
        }
        const prod = await Product.findById(productId)
        if(!prod){
            return res.json("Product not found")
        }
        console.log('prod ',prod);
        const cart = await Cart.findOne({userId})
        console.log('cart ',cart);

        const productIndex = cart.items.findIndex((item)=>{
            return item.productId.toString() === productId
        })
    if (productIndex == -1) {
        return res.json("Product not found in cart")
    }
    if (cart.items[productIndex].quantity) 
        cart.items[productIndex].quantity += 1;  
    

    await cart.save()
    res.json("Product updated from cart successfully.")

    }catch(err){
        return res.json("Error removing product to cart",err)
    }
})
    

export default router;