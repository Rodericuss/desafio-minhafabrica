import { Product } from "../models/productModel.js";

async function findAll() {
  return Product.find().sort({ createdAt: -1 });
}

async function findById(id) {
  return Product.findById(id);
}

async function create(productData) {
  return Product.create(productData);
}

async function updateById(id, productData) {
  return Product.findByIdAndUpdate(id, productData, {
    returnDocument: "after",
    runValidators: true,
  });
}

async function deleteById(id) {
  return Product.findByIdAndDelete(id);
}

const productRepository = Object.freeze({
  findAll,
  findById,
  create,
  updateById,
  deleteById,
});

export { productRepository };
