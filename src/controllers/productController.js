import Product from '../models/Product.js';
import redis from '../config/redis.js';

export const addProduct = async (req, res) => {
  const { name, description, price, imgURL, category } = req.body;

  if (!name) {
    return res.json('Kindly fill out Product name.');
  }

  const addedProduct = new Product({
    name,
    description,
    price,
    imgURL,
    category,
  });

  await redis.del('products:all');

  addedProduct
    .save()
    .then(() => {
      return res.json('Product added successfully.');
    })
    .catch((err) => {
      return res.json(err);
    });
};

export const viewProduct = async (req, res) => {
  try {
    let { page = 1, limit = 10, name, category } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    let filter = {};
    if (category) {
      filter.category = category;
    }
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    const cacheKey = `products:page=${page}:limit=${limit}:name=${
      name || 'all'
    }:cat=${category || 'all'}`;
    console.log('cacheKey ', cacheKey);

    const cached = await redis.get(cacheKey);
    console.log('cached ', cached);

    if (cached) {
      return res.json({ source: 'cache', data: JSON.parse(cached) });
    }

    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    await redis.setEx(cacheKey, 60, JSON.stringify(products));

    res.json({ source: 'db', data: products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body
  );
  if (!updatedProduct) {
    return res.json('Product not updated.');
  }

  await redis.del(`product:${req.params.id}`);
  await redis.del('products:all');

  updatedProduct.name = req.body.name;
  updatedProduct.description = req.body.description;
  updatedProduct.price = req.body.price;
  updatedProduct.imgURL = req.body.imgURL;
  updatedProduct.category = req.body.category;
  return res.json(updatedProduct);
};

export const deleteProduct = async (req, res) => {
  const { id } = req.body;

  const deletedProduct = await Product.findByIdAndDelete(req.params.id, id);
  if (!deletedProduct) {
    return res.json('Product not deleted.');
  }
  await redis.del(`product:${req.params.id}`);
  await redis.del('products:all');
  return res.json(
    `Product with name ${deletedProduct.name} deleted successfully.`
  );
};
