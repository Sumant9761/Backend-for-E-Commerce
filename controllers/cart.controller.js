import CartProductModel from "../models/cart.modal.js";

export async function addToCartItemController(req, res) {
  try {
    const userId = req.userId;
    const {
      productTitle,
      image,
      rating,
      price,
      quantity,
      subTotal,
      productId,
      countInStock,
      brand,
      size,
      weight,
      ram,
      oldPrice,
      discount,
    } = req.body;

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
      productTitle,
      image,
      rating,
      price,
      quantity,
      subTotal,
      productId,
      countInStock,
      userId,
      brand,
      size,
      weight,
      ram,
      oldPrice,
      discount,
    });

    const save = await cartItem.save();

    return res.status(200).json({
      data: save,
      message: "Item added successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

export async function getCartItemController(req, res) {
  try {
    const userId = req.userId;

    const cartItems = await CartProductModel.find({ userId });

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
    const { _id, qty, subTotal, size, weight, ram } = req.body;

    if (!_id) {
      return res.status(400).json({
        message: "Provide _id",
      });
    }

    // Build update object dynamically
    const updateFields = {};

    if (qty !== undefined) updateFields.quantity = qty;
    if (subTotal !== undefined) updateFields.subTotal = subTotal;
    if (size !== undefined) updateFields.size = size;
    if (weight !== undefined) updateFields.weight = weight;
    if (ram !== undefined) updateFields.ram = ram;

    const updateCartItem = await CartProductModel.updateOne(
      {
        _id: _id,
        userId: userId,
      },
      updateFields,
      { new: true },
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
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Provide _id",
        error: true,
        success: false,
      });
    }

    const deleteCartItem = await CartProductModel.deleteOne({
      _id: id,
      userId: userId,
    });

    if (!deleteCartItem) {
      return res.status(400).json({
        message: "The product in the cart is not found",
        error: true,
        success: false,
      });
    }

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

export async function emptyCartController(req, res){
  try {
    const userId = req.params.id  

    await CartProductModel.deleteMany({userId : userId})

   return res.status(200).json({
      success: true,
      error: false,
    });
    
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}