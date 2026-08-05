import { Router } from 'express';
import { uploadImages, createCategory, getCategories, getcategoriesCount, getSubcategoryCount, getSingleCategory, 
removeImageFromCloudinary, deleteCategory, updateCategory } from '../controllers/category.controller.js';
import auth from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';

const categoryRouter = Router();

categoryRouter.post("/uploadImages", auth, upload.array("images"), uploadImages);
categoryRouter.post("/create", auth, createCategory);
categoryRouter.get("/", getCategories);
categoryRouter.get("/get/count", auth, getcategoriesCount);
categoryRouter.get("/get/count/subCat", getSubcategoryCount);
categoryRouter.get("/:id", getSingleCategory);
categoryRouter.delete("/deleteImage", auth, removeImageFromCloudinary);
categoryRouter.delete("/:id", auth, deleteCategory);
categoryRouter.put("/:id", auth, updateCategory);

export default categoryRouter;