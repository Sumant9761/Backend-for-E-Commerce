import { Router } from 'express';
import { addBlog, deleteBlog, getBlogs, getSingleBlog, updateBlog, uploadImages } from '../controllers/blog.controller.js';
import auth from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';
import { removeImageFromCloudinary } from '../controllers/category.controller.js';


const blogRouter = Router();

blogRouter.post("/uploadImages", auth, upload.array("images"), uploadImages);
blogRouter.post("/add", auth, addBlog);
blogRouter.get("/", getBlogs);
blogRouter.get("/:id", getSingleBlog);
blogRouter.delete("/deleteImage", auth, removeImageFromCloudinary);
blogRouter.delete("/:id", auth, deleteBlog);
blogRouter.put("/:id", auth, updateBlog);

export default blogRouter;