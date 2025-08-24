import Product from "../models/Product.js";

export const addProduct = async (req, res) => {
  const { name, description, price, imgURL, category } = req.body;

  if (!name) {
    return res.json("Kindly fill out Product name.");
  }

  const addedProduct = new Product({
    name,
    description,
    price,
    imgURL,
    category,
  });
  addedProduct
    .save()
    .then(() => {
      return res.json("Product added successfully.");
    })
    .catch((err) => {
      return res.json(err);
    });
};

export const viewProduct = async (req, res) => {
  const viewedProduct = await Product.find();
  res.json(viewedProduct);
};

export const updateProduct = async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body
  );
  if (updatedProduct) {
    updatedProduct.name = req.body.name;
    updatedProduct.description = req.body.description;
    updatedProduct.price = req.body.price;
    updatedProduct.imgURL = req.body.imgURL;
    updatedProduct.category = req.body.category;
    return res.json(updatedProduct);
  } else {
    return res.json("Product not updated.");
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.body;

  const deletedProduct = await Product.findByIdAndDelete(req.params.id, id);
  if (deletedProduct) {
    return res.json(
      `Product with name ${deletedProduct.name} deleted successfully.`
    );
  } else {
    return res.json("Product not deleted.");
  }
};
