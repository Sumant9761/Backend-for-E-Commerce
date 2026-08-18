import MyListModel from "../models/myList.modal.js";

export async function addToMyListController(req, res) {
  try {
    const userId = req.userId;
    const {
      productId,
      productTitle,
      image,
      rating,
      price,
      oldPrice,
      brand,
      discount,
    } = req.body;

    const item = await MyListModel.findOne({
      userId: userId,
      productId: productId,
    });

    if (item) {
      return res.status(400).json({
        message: "Item already in my list",
      });
    }
    const myList = new MyListModel({
      productId,
      productTitle,
      image,
      rating,
      price,
      oldPrice,
      brand,
      discount,
      userId,
    });

    const save = await myList.save();

    return res.status(200).json({
      success: true,
      error: false,
      message: "The product added in the List",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

export async function deleteToMyListController(req, res) {
  try {
    const myListItem = await MyListModel.findById(req.params.id);

    if (!myListItem) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "The item with this given id was not found",
      });
    }

    const deletedItem = await MyListModel.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "The item is not Deleted!",
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      message: "Item removed from My List",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

export async function getMyListController(req, res) {
  try {
    const userId = req.userId;

    const myListItems = await MyListModel.find({ userId: userId });
    
    return res.status(200).json({
      success: true,
      error: false,
      data: myListItems,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}
