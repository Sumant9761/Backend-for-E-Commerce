import { Router } from "express";
import {
  uploadImages,
  createProduct,
  getAllProducts,
  getAllProductsByCatId,
  getAllProductsByCatName,
  getAllProductsBySubCatId,
  getAllProductsBySubCatName,
  getAllProductsByThirdLevelSubCatId,
  getAllProductsByThirdLevelSubCatName,
  getAllProductsByPrice,
  getAllProductsByRating,
  getProductsCount,
  getAllFeaturedProducts,
  deleteProduct,
  getSingleProduct,
  removeImageFromCloudinary,
  updateProduct,
  deleteMultipleProduct,
  createProductRAMS,
  deleteProductRAMS,
  updateProductRAMS,
  getProductRAMS,
  getProductRAMSById,
  createProductWeight,
  deleteProductWeight,
  updateProductWeight,
  getProductWeight,
  getProductWeightById,
  createProductSize,
  deleteProductSize,
  updateProductsize,
  getProductSize,
  getProductSizeById,
  uploadBannerImages,
  filterProducts,
  sortBy,
  searchProductController,
} from "../controllers/product.controller.js";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const productRouter = Router();

productRouter.post("/uploadImages", auth, upload.array("images"), uploadImages);
productRouter.post("/uploadBannerImages", auth, upload.array("images"), uploadBannerImages);
productRouter.post("/create", auth, createProduct);
productRouter.get("/getAllProducts", getAllProducts);
productRouter.get("/getAllProductsByCatId/:id", getAllProductsByCatId);
productRouter.get("/getAllProductsByCatName", getAllProductsByCatName);
productRouter.get("/getAllProductsBySubCatId/:id", getAllProductsBySubCatId);
productRouter.get("/getAllProductsBySubCatName", getAllProductsBySubCatName);
productRouter.get(
  "/getAllProductsByThirdLevelSubCat/:id",
  getAllProductsByThirdLevelSubCatId,
);
productRouter.get(
  "/getAllProductsByThirdLevelSubCatName",
  getAllProductsByThirdLevelSubCatName,
);
productRouter.get("/getAllProductsByPrice", getAllProductsByPrice);
productRouter.get("/getAllProductsByRating", getAllProductsByRating);
productRouter.get("/getProductsCount", getProductsCount);
productRouter.get("/getAllFeaturedProducts", getAllFeaturedProducts);
productRouter.delete("/deleteMultiple", deleteMultipleProduct);
productRouter.delete("/deleteImage", auth, removeImageFromCloudinary);
productRouter.delete("/:id", deleteProduct);
productRouter.get("/:id", getSingleProduct);
productRouter.put("/updateProduct/:id", auth, updateProduct);

// ProductRAMS based Routes
productRouter.post("/productRAMS/create", auth, createProductRAMS);
productRouter.delete("/productRAMS/:id", deleteProductRAMS);
productRouter.put("/updateProductRAMS/:id", auth, updateProductRAMS);
productRouter.get("/productRAMS/get", getProductRAMS);
productRouter.get("/productRAMS/:id", getProductRAMSById);

// ProductWeight based Routes
productRouter.post("/productWeight/create", auth, createProductWeight);
productRouter.delete("/productWeight/:id", deleteProductWeight);
productRouter.put("/updateProductWeight/:id", auth, updateProductWeight);
productRouter.get("/productWeight/get", getProductWeight);
productRouter.get("/productWeight/:id", getProductWeightById);

// ProductSize based Routes
productRouter.post("/productSize/create", auth, createProductSize);
productRouter.delete("/productSize/:id", deleteProductSize);
productRouter.put("/updateProductSize/:id", auth, updateProductsize);
productRouter.get("/productSize/get", getProductSize);
productRouter.get("/productSize/:id", getProductSizeById);

// Product filters
productRouter.post("/filters", filterProducts);
productRouter.post("/sortBy", sortBy);
productRouter.post("/search", searchProductController);
productRouter.get("/search", searchProductController);

export default productRouter;
