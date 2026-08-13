import HomeSliderModel from "../models/homeSlider.js";

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});

//Image upload
var imagesArr = [];
export async function uploadImages(req, res) {
  try {
    imagesArr = [];

    const image = req.files;

    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: false,
    };

    for (let i = 0; i < image?.length; i++) {
      const img = await cloudinary.uploader.upload(
        image[i].path,
        options,
        function (error, result) {
          imagesArr.push(result.secure_url);
          fs.unlinkSync(`uploads/${image[i].filename}`);
        },
      );
    }

    return res.status(200).json({
      images: imagesArr,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Add Home Slide
export async function addHomeSlide(req, res) {
  try {
    let slide = new HomeSliderModel({
      images: imagesArr,
    });

    if (!slide) {
      return res.status(404).json({
        message: "Slide not created",
        success: false,
        error: true,
      });
    }

    slide = await slide.save();

    imagesArr = [];

    return res.status(200).json({
      message: "Slide created successfully",
      data: slide,
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Get all slides
export async function getHomeSlides(req, res) {
  try {
    const slides = await HomeSliderModel.find();

    if (!slides) {
      return res.status(404).json({
        message: "Slides not found",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      data: slides,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//  Get single slide
export async function getSingleHomeSlide(req, res) {
  try {
    const slide = await HomeSliderModel.findById(req.params.id);

    if (!slide) {
      return res.status(404).json({
        message: "The slide with the given ID, was not found",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      data: slide,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//Remove image from cloudinary for any user
export async function removeImageFromCloudinary(req, res) {
  const imgUrl = req.query.img;
  const urlArr = imgUrl.split("/");
  const image = urlArr[urlArr.length - 1];

  const imageName = image.split(".")[0];

  if (imageName) {
    const response = await cloudinary.uploader.destroy(
      imageName,
      (error, result) => {
        // console.log(error,res)
      },
    );
    if (response) {
      return res.status(200).json({
        message: "Image deleted successfully",
        error: false,
        success: true,
      });
    }
  }
}

//  Delete single slide
export async function deleteSlide(req, res) {
  try {
    const slide = await HomeSliderModel.findById(req.params.id);

    const images = slide.images;
    let img = "";

    for (img of images) {
      const imgUrl = img;
      const urlArr = imgUrl.split("/");
      const image = urlArr[urlArr.length - 1];

      const imageName = image.split(".")[0];

      if (imageName) {
        cloudinary.uploader.destroy(imageName, (error, result) => {
          //console.log(error, result);
        });
      }
    }

    const deletedSlide = await HomeSliderModel.findByIdAndDelete(req.params.id);

    if (!deletedSlide) {
      return res.status(404).json({
        message: "Slide not found",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "Slide deleted successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//  Update slide
export async function updateSlide(req, res) {
  try {
    const updatedSlide = await HomeSliderModel.findByIdAndUpdate(
      req.params.id,
      { images: imagesArr > 0 ? imagesArr[0] : req.body.images },
      { new: true },
    );

    if (!updatedSlide) {
      return res.status(404).json({
        message: "Slide can't be updated",
        success: false,
        error: true,
      });
    }

    imagesArr = [];

    return res.status(200).json({
      message: "Slide updated successfully",
      data: updatedSlide,
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//  Delete multiple slides
export async function deleteMultipleSlides(req, res) {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({
      success: false,
      error: true,
      message: "No IDs provided",
    });
  }

  // Delete images from Cloudinary for each product
  for (let i = 0; i < ids?.length; i++) {
    const slide = await HomeSliderModel.findById(ids[i]);

    const images = slide.images;

    let img = "";

    for (img of images) {
      const imageUrl = img;
      const urlArr = imageUrl.split("/");
      const image = urlArr[urlArr.length - 1];

      const imageName = image.split(".")[0];

      if (imageName) {
        cloudinary.uploader.destroy(imageName, (error, result) => {
          //console.log(error, result);
        });
      }
    }
  }

  try {
    await HomeSliderModel.deleteMany({ _id: { $in: ids } });
    return res.status(200).json({
      message: "Slide delete successfully",
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
