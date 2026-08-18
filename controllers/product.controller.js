import ProductModel from "../models/product.modal.js";
import ProductRAMSModel from "../models/productRAMS.js";
import ProductWeightModel from "../models/productWeight.js";
import ProductSizeModel from "../models/productSize.js";

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

var bannerImage = [];
export async function uploadBannerImages(req, res) {
  try {
    bannerImage = [];

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
          bannerImage.push(result.secure_url);
          fs.unlinkSync(`uploads/${image[i].filename}`);
        },
      );
    }

    return res.status(200).json({
      images: bannerImage,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//Create Product
export async function createProduct(req, res) {
  try {
    let product = new ProductModel({
      name: req.body.name,
      description: req.body.description,
      images: imagesArr,
      bannerImages: bannerImage,
      bannerTitleName: req.body.bannerTitleName,
      isDisplayOnHomeBanner: req.body.isDisplayOnHomeBanner,
      brand: req.body.brand,
      price: req.body.price,
      oldPrice: req.body.oldPrice,
      catName: req.body.catName,
      category: req.body.category,
      catId: req.body.catId,
      subCatId: req.body.subCatId,
      subCat: req.body.subCat,
      thirdsubCat: req.body.thirdsubCat,
      thirdsubCatId: req.body.thirdsubCatId,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      isFeatured: req.body.isFeatured,
      discount: req.body.discount,
      productRam: req.body.productRam,
      size: req.body.size,
      productWeight: req.body.productWeight,
    });

    product = await product.save();

    if (!product) {
      return res.status(500).json({
        message: "Product not created",
        success: false,
        error: true,
        product: product,
      });
    }

    imagesArr = [];

    return res.status(200).json({
      message: "Product created successfully",
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

//Get all products
export async function getAllProducts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage);
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return res.status(404).json({
        message: "Page not found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find()
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products) {
      return res.status(500).json({
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      products: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//Get all products by cat id
export async function getAllProductsByCatId(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return res.status(404).json({
        message: "Page not found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find({
      catId: req.params.id,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products) {
      return res.status(500).json({
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      products: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//Get all products by category name
export async function getAllProductsByCatName(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return res.status(404).json({
        message: "Page not found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find({
      catName: req.query.catName,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products) {
      return res.status(500).json({
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      products: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//Get all products by sub category id
export async function getAllProductsBySubCatId(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return res.status(404).json({
        message: "Page not found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find({
      subCatId: req.params.id,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products) {
      return res.status(500).json({
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      products: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//Get all products by sub category name
export async function getAllProductsBySubCatName(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return res.status(404).json({
        message: "Page not found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find({
      subCat: req.query.subCat,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products) {
      return res.status(500).json({
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      products: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//Get all products by third sub category id
export async function getAllProductsByThirdLevelSubCatId(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return res.status(404).json({
        message: "Page not found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find({
      thirdsubCatId: req.params.id,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products) {
      return res.status(500).json({
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      products: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//Get all products by third sub category name
export async function getAllProductsByThirdLevelSubCatName(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return res.status(404).json({
        message: "Page not found",
        success: false,
        error: true,
      });
    }

    const products = await ProductModel.find({
      thirdsubCat: req.query.thirdsubCat,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products) {
      return res.status(500).json({
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      products: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//Get all products by price
export async function getAllProductsByPrice(req, res) {
  try {
    let productList = [];

    if (req.query.catId !== "" && req.query.catId !== undefined) {
      const productListArr = await ProductModel.find({
        catId: req.query.catId,
      }).populate("category");

      productList = productListArr;
    }

    if (req.query.subCatId !== "" && req.query.subCatId !== undefined) {
      const productListArr = await ProductModel.find({
        subCatId: req.query.subCatId,
      }).populate("category");

      productList = productListArr;
    }

    if (
      req.query.thirdsubCatId !== "" &&
      req.query.thirdsubCatId !== undefined
    ) {
      const productListArr = await ProductModel.find({
        thirdsubCatId: req.query.thirdsubCatId,
      }).populate("category");

      productList = productListArr;
    }

    const filteredProducts = productList.filter((product) => {
      if (req.query.minPrice && product.price < parseInt(req.query.minPrice)) {
        return false;
      }
      if (req.query.maxPrice && product.price > parseInt(req.query.maxPrice)) {
        return false;
      }
      return true;
    });

    return res.status(200).json({
      error: false,
      success: true,
      products: filteredProducts,
      totalPages: 0,
      page: 0,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//Get all products by rating
export async function getAllProductsByRating(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10000;

    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return res.status(404).json({
        message: "Page not found",
        success: false,
        error: true,
      });
    }

    let products = [];

    if (req.query.catId !== undefined) {
      products = await ProductModel.find({
        rating: req.query.rating,
        catId: req.query.catId,
      })
        .populate("category")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
    }

    if (req.query.subCatId !== undefined) {
      products = await ProductModel.find({
        rating: req.query.rating,
        subCatId: req.query.subCatId,
      })
        .populate("category")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
    }

    if (req.query.thirdsubCatId !== undefined) {
      products = await ProductModel.find({
        rating: req.query.rating,
        thirdsubCatId: req.query.thirdsubCatId,
      })
        .populate("category")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
    }

    if (!products) {
      return res.status(500).json({
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      products: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get All products count
export async function getProductsCount(req, res) {
  try {
    const productsCount = await ProductModel.countDocuments();

    return res.status(200).json({
      success: true,
      error: false,
      productsCount: productsCount || 0,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

//get all featured Product
export async function getAllFeaturedProducts(req, res) {
  try {
    const products = await ProductModel.find({
      isFeatured: true,
    }).populate("category");

    if (!products) {
      return res.status(500).json({
        message: "No products found",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "Products retrieved successfully",
      success: true,
      error: false,
      products: products,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

//delete single Product
export async function deleteProduct(req, res) {
  const product = await ProductModel.findById(req.params.id).populate(
    "category",
  );

  if (!product) {
    return res.status(404).json({
      message: "No products found",
      success: false,
      error: true,
    });
  }

  const images = product.images;
  let img;

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

  const deleteProduct = await ProductModel.findByIdAndDelete(req.params.id);

  if (!deleteProduct) {
    return res.status(404).json({
      message: "Product not deleted!",
      success: false,
      error: true,
    });
  }

  return res.status(200).json({
    message: "Product deleted!",
    success: true,
    error: false,
  });
}

//delete multiple Product
export async function deleteMultipleProduct(req, res) {
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
    const product = await ProductModel.findById(ids[i]);

    const images = product.images;

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
    await ProductModel.deleteMany({ _id: { $in: ids } });
    return res.status(200).json({
      message: "Product delete successfully",
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

//get single product
export async function getSingleProduct(req, res) {
  try {
    const product = await ProductModel.findById(req.params.id);
    // .populate("category");

    if (!product) {
      return res.status(404).json({
        message: "No products found",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "Product found!",
      success: true,
      error: false,
      product: product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
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
      res.status(200).send(response);
    }
  }
}

//Update product
export async function updateProduct(req, res) {
  try {
    const product = await ProductModel.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        images: req.body.images,
        bannerImages: req.body.bannerImages,
        bannerTitleName: req.body.bannerTitleName,
        isDisplayOnHomeBanner: req.body.isDisplayOnHomeBanner,
        brand: req.body.brand,
        price: req.body.price,
        oldPrice: req.body.oldPrice,
        catName: req.body.catName,
        catId: req.body.catId,
        subCatId: req.body.subCatId,
        subCat: req.body.subCat,
        thirdsubCat: req.body.thirdsubCat,
        thirdsubCatId: req.body.thirdsubCatId,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        isFeatured: req.body.isFeatured,
        discount: req.body.discount,
        productRam: req.body.productRam,
        size: req.body.size,
        productWeight: req.body.productWeight,
      },
      {
        new: true,
      },
    );

    if (!product) {
      return res.status(404).json({
        message: "Product can not be updated!",
        status: false,
      });
    }

    imagesArr = [];

    return res.status(200).json({
      message: "The product is updated",
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

// Create New ProductRAMS
export async function createProductRAMS(req, res) {
  try {
    let productRAMS = new ProductRAMSModel({
      name: req.body.name,
    });
    productRAMS = await productRAMS.save();

    if (!productRAMS) {
      return res.status(404).json({
        message: "ProductRAMS not Created",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "ProductRAMS Created successfully!",
      success: true,
      error: false,
      product: productRAMS,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

//delete single ProductRAMS
export async function deleteProductRAMS(req, res) {
  const productRAMS = await ProductRAMSModel.findById(req.params.id);

  if (!productRAMS) {
    return res.status(404).json({
      message: "Item not found",
      success: false,
      error: true,
    });
  }

  const deleteProductRAMS = await ProductRAMSModel.findByIdAndDelete(
    req.params.id,
  );

  if (!deleteProductRAMS) {
    return res.status(404).json({
      message: "items not deleted!",
      success: false,
      error: true,
    });
  }

  return res.status(200).json({
    message: "Product RAMS deleted!",
    success: true,
    error: false,
  });
}

//Update productRAM
export async function updateProductRAMS(req, res) {
  try {
    const productRAM = await ProductRAMSModel.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
      },
      { new: true },
    );

    if (!productRAM) {
      return res.status(404).json({
        message: "ProductRAM can not be updated!",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "ProductRAM updated successfully!",
      success: true,
      error: false,
      data: productRAM,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

//Get all productRAMS
export async function getProductRAMS(req, res) {
  try {
    const productRAM = await ProductRAMSModel.find();
    if (!productRAM) {
      return res.status(404).json({
        message: "ProductRAM can not be get!",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      data: productRAM,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

//Get Single RAMS
export async function getProductRAMSById(req, res) {
  try {
    const productRAM = await ProductRAMSModel.findById(req.params.id);
    if (!productRAM) {
      return res.status(404).json({
        message: "ProductRAMS can not be get!",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      data: productRAM,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
}

// Create New ProductWeight
export async function createProductWeight(req, res) {
  try {
    let productWeight = new ProductWeightModel({
      name: req.body.name,
    });

    productWeight = await productWeight.save();

    if (!productWeight) {
      return res.status(404).json({
        message: "ProductWeight is not Created",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "ProductWeight Created successfully!",
      success: true,
      error: false,
      product: productWeight,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

//delete single ProductWeight
export async function deleteProductWeight(req, res) {
  const productWeight = await ProductWeightModel.findById(req.params.id);

  if (!productWeight) {
    return res.status(404).json({
      message: "No item found",
      success: false,
      error: true,
    });
  }

  const deleteProductWeight = await ProductWeightModel.findByIdAndDelete(
    req.params.id,
  );

  if (!deleteProductWeight) {
    return res.status(404).json({
      message: "items not deleted!",
      success: false,
      error: true,
    });
  }

  return res.status(200).json({
    message: "Product Weight deleted successfully!",
    success: true,
    error: false,
  });
}

//Update productWeight
export async function updateProductWeight(req, res) {
  try {
    const productWeight = await ProductWeightModel.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
      },
      { new: true },
    );

    if (!productWeight) {
      return res.status(404).json({
        message: "The productWeight can not be updated!",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "The productWeight is updated successfully!",
      success: true,
      error: false,
      data: productWeight,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

//Get all productWeight
export async function getProductWeight(req, res) {
  try {
    const productWeight = await ProductWeightModel.find();
    if (!productWeight) {
      return res.status(404).json({
        message: "The productWeight can not be get!",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      data: productWeight,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
}

//Get Single  Weight
export async function getProductWeightById(req, res) {
  try {
    const productWeight = await ProductWeightModel.findById(req.params.id);
    if (!productWeight) {
      return res.status(404).json({
        message: "The productWeight can not be get!",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      data: productWeight,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
}

// Create New ProductSize
export async function createProductSize(req, res) {
  try {
    let productSize = new ProductSizeModel({
      name: req.body.name,
    });
    productSize = await productSize.save();

    if (!productSize) {
      return res.status(404).json({
        message: "The product size is not Created",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "The productSize is Created successfully!",
      success: true,
      error: false,
      product: productSize,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

//delete single ProductSize
export async function deleteProductSize(req, res) {
  const productSize = await ProductSizeModel.findById(req.params.id);

  if (!productSize) {
    return res.status(404).json({
      message: "No item found",
      success: false,
      error: true,
    });
  }

  const deleteProductSize = await ProductSizeModel.findByIdAndDelete(
    req.params.id,
  );

  if (!deleteProductSize) {
    return res.status(404).json({
      message: "Items not deleted!",
      success: false,
      error: true,
    });
  }

  return res.status(200).json({
    message: "Product Size deleted successfully!",
    success: true,
    error: false,
  });
}

//Update productSize
export async function updateProductsize(req, res) {
  try {
    const productSize = await ProductSizeModel.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
      },
      { new: true },
    );

    if (!productSize) {
      return res.status(404).json({
        message: "The productSize can not be updated!",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "productSize updated successfully!",
      success: true,
      error: false,
      data: productSize,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

//Get all productSize
export async function getProductSize(req, res) {
  try {
    const productSize = await ProductSizeModel.find();
    if (!productSize) {
      return res.status(404).json({
        message: "The productSize can't be get!",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      data: productSize,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
}

//Get Single Size
export async function getProductSizeById(req, res) {
  try {
    const productSize = await ProductSizeModel.findById(req.params.id);
    if (!productSize) {
      return res.status(404).json({
        message: "The productSize can't be get!",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      data: productSize,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

//filter product
export async function filterProducts(req, res) {
  try {
    const {
      catId,
      subCatId,
      thirdsubCatId,
      minPrice,
      maxPrice,
      rating,
      page,
      limit,
    } = req.body;

    const filters = {};

    // ONLY add catId filter if array has items
    if (catId?.length) {
      filters.catId = { $in: catId };
    }

    if (subCatId?.length) {
      filters.subCatId = { $in: subCatId };
    }

    if (thirdsubCatId?.length) {
      filters.thirdsubCatId = { $in: thirdsubCatId };
    }

    if (minPrice || maxPrice) {
      filters.price = { $gte: +minPrice || 0, $lte: +maxPrice || Infinity };
    }

    if (rating?.length) {
      filters.rating = { $in: rating };
    }

    const products = await ProductModel.find(filters)
      .populate("category")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await ProductModel.countDocuments(filters);

    return res.status(200).json({
      success: true,
      error: false,
      message: "Products filtered successfully",
      products: products,
      total: total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

//sortItems
const sortItems = (products, sortBy, order) => {
  return products.sort((a, b) => {
    if (sortBy === "name") {
      return order === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }

    if (sortBy === "price") {
      return order === "asc" ? a.price - b.price : b.price - a.price;
    }
    return 0;
  });
};

export async function sortBy(req, res) {
  const { products, sortBy, order } = req.body;
  const sortedItems = sortItems([...products?.products], sortBy, order);

  return res.status(200).json({
    error: false,
    success: true,
    products: sortedItems,
    totalPages: 0,
    page: 0,
  });
}


// Search products controller
export async function searchProductController(req, res) {
  try {
    const query = req.body?.query || req.body?.q || req.query?.query || req.query?.q || "";

    if (!query || query.trim() === "") {
      return res.status(200).json({
        success: true,
        error: false,
        products: [],
        total: 0,
      });
    }

    // Escape special regex characters
    const safeQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const searchRegex = new RegExp(safeQuery, "i");

    const products = await ProductModel.find({
      $or: [
        { name: searchRegex },
        { brand: searchRegex },
        { catName: searchRegex },
        { subCat: searchRegex },
        { thirdsubCat: searchRegex },
        { description: searchRegex },
      ],
    }).populate("category");

    return res.status(200).json({
      success: true,
      error: false,
      products: products,
      total: products.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}