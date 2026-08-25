import mongoose from "mongoose";

function transformProduct(_document, returnedObject) {
  returnedObject.id = returnedObject._id.toString();

  delete returnedObject._id;
  delete returnedObject.__v;

  return returnedObject;
}

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxLength: [120, "Name must have at most 120 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxLength: [1_000, "Description must have at most 1000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [Number.MIN_VALUE, "Price must be greater than zero"],
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock must be greater than or equal to zero"],
      validate: {
        validator: Number.isInteger,
        message: "Stock must be an integer",
      },
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      maxLength: [100, "Category must have at most 100 characters"],
    },
  },
  {
    timestamps: true,
    toJSON: { transform: transformProduct },
    toObject: { transform: transformProduct },
  },
);

const Product = mongoose.model("Product", productSchema);

export { Product };
