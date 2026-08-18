import mongoose from "mongoose";

const cartProductSchema = mongoose.Schema(
  {
    productTitle: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    oldPrice: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    quantity: {
      type: Number,
      required: true,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    countInStock: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
    },
    size: {
      type: String,
    },
    weight: {
      type: String,
    },
    ram: {
      type: String,
    },
  },
  { timestamps: true },
);

const CartProductModel = mongoose.model("cartProduct", cartProductSchema);

export default CartProductModel;
