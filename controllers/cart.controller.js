import CartProductModel from "../models/cart.modal.js";
import Usermodel from "../models/user.model.js";

export async function addToCartItemController(req, res) {
  try {
    const userId = req.userId;
    const { productId } = req.body;

    if (!productId) {
      return res.status(402).json({
        message: "Provide ProductId",
        success: false,
        error: true,
      });
    }

    const checkItemCart = await CartProductModel.findOne({
      userId,
      productId,
    });

    if (checkItemCart) {
      return res.status(400).json({
        message: "Item already in Cart",
      });
    }

    const cartItem = new CartProductModel({
      quantity: 1,
      productId,
      userId,
    });

    const save = await cartItem.save();

    const updateCartUser = await Usermodel.updateOne(
      { _id: userId },
      {
        $push: {
          shopping_cart: productId,
        },
      },
    );

    return res.status(200).json({
      data: save,
      message: "Item add successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

export async function getCartItemController(req, res) {
  try {
    const userId = req.userId;

    const cartItems = await CartProductModel.find({ userId }).populate(
      "productId",
    );

    return res.json({
      data: cartItems,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

export async function updateCartItemQtyController(req, res) {
  try {
    const userId = req.userId;
    const { _id, qty } = req.body;

    if (!_id || !qty) {
      return res.status(400).json({
        message: "Provide _id and qty",
      });
    }

    const updateCartItem = await CartProductModel.updateOne(
      {
        _id: _id,
        userId: userId,
      },
      {
        quantity: qty,
      }
    );

    return res.json({
      message: "Update cart",
      success: true,
      error: false,
      data: updateCartItem,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}


export async function deleteCartItemQtyController(req, res) {
  try {
    const userId = req.userId;
    const { _id, productId } = req.body;

    if (!_id) {
      return res.status(400).json({
        message: "Provide _id",
        error: true,
        success: false,
      });
    }

    const deleteCartItem = await CartProductModel.deleteOne({
      _id: _id,
      userId: userId,
    });

    if (!deleteCartItem) {
      return res.status(400).json({
        message: "The product in the cart is not found",
        error: true,
        success: false,
      });
    }

    const user = await Usermodel.findOne({ _id: userId });

    const cartItems = user.shopping_cart;

    const updatedUserCart = [...cartItems.slice(0, cartItems.indexOf(productId)), ...
        cartItems.slice(cartItems.indexOf(productId) + 1)];

    user.shopping_cart = updatedUserCart;
    await user.save();

    return res.status(200).json({
      message: "Item remove",
      success: true,
      error: false,
      data: deleteCartItem,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

