import CategoryModel from "../models/category.modal.js";

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

    for(let i=0; i<image?.length; i++){
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
      images: imagesArr
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}


export async function createCategory(req, res) {
  try{
    let category = new CategoryModel({
      name: req.body.name,
      images: imagesArr,
      parentId: req.body.parentId,
      parentCatName: req.body.parentCatName
    });

    if(!category){
      return res.status(500).json({
        message: "Category not created",
        error: true,
        success: false,
      });
    }

    category = await category.save();

    imagesArr = [];

    return res.status(200).json({
      message: "Category created",
      error: false,
      success: true,
      category: category
    });

  }catch(error){
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Get Categories (with nested subcategories)
export async function getCategories(req, res) {
  try {
    const categories = await CategoryModel.find();
    const categoryMap = {};

    // 1. Initialize each category with children = []
    categories.forEach((cat) => {
      categoryMap[cat._id] = { ...cat._doc, children: [] };
    });

    // 2. Organize into hierarchy
    const rootCategories = [];

    categories.forEach((cat) => {
      if (cat.parentId) {
        if (categoryMap[cat.parentId]) {
          categoryMap[cat.parentId].children.push(categoryMap[cat._id]);
        }
      } else {
        rootCategories.push(categoryMap[cat._id]);
      }
    });

    return res.status(200).json({
      success: true,
      error: false,
      data: rootCategories,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//Get categories count
export async function getcategoriesCount(req, res) {
  try {
    const categoriesCount = await CategoryModel.countDocuments({ parentId: undefined });

    if (!categoriesCount) {
      return res.status(500).json({
        error: true,
        success: false,
      });
    } else {
      res.send({
        CategoryCount: categoriesCount,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//Get sub-categories count
export async function getSubcategoryCount(req, res) {
  try {
    const categories = await CategoryModel.find();

    if (!categories) {
      return res.status(500).json({
        error: true,
        success: false,
      });
    } else {
      const subCatList = [];
      for (let cat of categories) {
        if (cat.parentId !== undefined) {
          subCatList.push(cat);
        }
      }
      res.send({
        SubCategoryCount: subCatList.length,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Error creating category",
      error: true,
      success: false,
    });
  }
}

//get single category
export async function getSingleCategory(req, res) {
  try {
    const category = await CategoryModel.findById(req.params.id);

    if (!category) {
      return res.status(500).json({
        message: "The Category with the given ID was not found ",
        error: true,
        success: false,
      });
    }
    res.status(200).send({
      error: false,
      success: true,
      category: category,
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
        success: true
      })
    }
  }
}

// Delete Category from database
export async function deleteCategory(req, res) {
  try {
    const category = await CategoryModel.findById(req.params.id);
    const images = category.images;
    let img = "";

    for (img of images) {
      const imgUrl = img;
      const urlArr = imgUrl.split("/");
      const image = urlArr[urlArr.length - 1];

      const imageName = image.split(".")[0];

      if(imageName){
        cloudinary.uploader.destroy(imageName, (error, result) => {
          //console.log(error, result);
        });
      }
    }
    
    // Delete all subcategories (and their children)
    const subCategory = await CategoryModel.find({ parentId: req.params.id });

    for (let i=0; i<subCategory.length; i++) {
      const thirdSubCategory = await CategoryModel.find({ parentId: subCategory[i]._id });

      for (let i=0; i<thirdSubCategory.length; i++) {
        const deleteThirdSubCat = await CategoryModel.findByIdAndDelete(thirdSubCategory[i]._id);
      }

      const deleteSubCat = await CategoryModel.findByIdAndDelete(subCategory[i]._id);
    }

    const deletedCat = await CategoryModel.findByIdAndDelete(req.params.id);

    if(!deletedCat){
      return res.status(404).json({
        message: "Category not found",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "Category Deleted!",
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

// Update Category
export async function updateCategory(req, res) {
  try{
    const category = await CategoryModel.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        images: imagesArr.length>0 ? imagesArr[0] : req.body.images,
        parentId: req.body.parentId,
        parentCatName: req.body.parentCatName
      },
      { new: true }
    );

    if(!category){
      return res.status(500).json({
        message: "Category can't be updated",
        success: false,
        error: true,
      }); 
    }

    imagesArr = [];

    return res.status(200).json({
      message: "Category updated",
      success: true,
      error: false,
      category: category
    }); 

  }catch(error){
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

