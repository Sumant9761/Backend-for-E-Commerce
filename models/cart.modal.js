import mongoose from "mongoose";

const cartProductSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      default: true
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
  },
  { timestamps: true },
);

const CartProductModel = mongoose.model("cartProduct", cartProductSchema);

export default CartProductModel;
