import AddressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js";

export async function addAddressController(req, res) {
  try {
    const {
      address_line1,
      city,
      state,
      pincode,
      country,
      mobile,
      landmark,
      addressType,
    } = req.body;

    const userId = req.userId;

    if (
      !address_line1 ||
      !city ||
      !state ||
      !pincode ||
      !country ||
      !mobile ||
      !landmark ||
      !addressType
    ) {
      return res.status(400).json({
        message: "All fields are required",
        error: true,
        success: false,
      });
    }

    const address = new AddressModel({
      address_line1,
      city,
      state,
      pincode,
      country,
      mobile,
      landmark,
      addressType,
      userId,
    });

    const savedAddress = await address.save();

    // Update user with new address
    await UserModel.updateOne(
      { _id: userId },
      {
        $push: {
          address_details: savedAddress,
        },
      },
    );

    return res.status(200).json({
      message: "Address added successfully",
      data: savedAddress,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function getAddressController(req, res) {
  try {
    const userId = req?.query?.userId;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
        error: true,
        success: false,
      });
    }

    const address = await AddressModel.find({ userId });

    return res.status(200).json({
      message: "Address fetched successfully",
      data: address,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function deleteAddressController(req, res) {
  try {
    const userId = req.userId;
    const _id = req.params.addressId;

    if (!_id) {
      return res.status(400).json({
        message: "provide _id",
        error: true,
        success: false,
      });
    }

    const deleteItem = await AddressModel.deleteOne({
      _id: _id,
      userId: userId,
    });

    if (deleteItem.deletedCount === 0) {
      return res.status(400).json({
        message: "Address not found",
        error: true,
        success: false,
      });
    }

    return res.json({
      message: "Address deleted",
      success: true,
      error: false,
      data: deleteItem,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
}

export async function getSingleAddressController(req, res) {
  try {
    const id = req.params.id;
    const address = await AddressModel.findOne({ _id: id });

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
        success: false,
        error: true,
      });
    }
    return res.status(200).json({
      message: "Address fetched successfully",
      address: address,
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
}

export async function editAddress(req, res) {
  try {
    const addressId = req.params.id;

    if (!addressId) {
      return res.status(400).json({
        message: "Address ID is required",
        error: true,
        success: false,
      });
    }

    const {
      address_line1,
      city,
      state,
      pincode,
      country,
      mobile,
      landmark,
      addressType,
    } = req.body;

    const address = await AddressModel.findByIdAndUpdate(
      addressId,
      {
        address_line1,
        city,
        state,
        pincode,
        country,
        mobile,
        landmark,
        addressType,
      },
      { new: true },
    );

    return res.status(200).json({
      message: "Address Updated successfully",
      error: false,
      success: true,
      address: address,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
