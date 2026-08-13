import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import {
  addHomeSlide,
  deleteMultipleSlides,
  deleteSlide,
  getHomeSlides,
  getSingleHomeSlide,
  removeImageFromCloudinary,
  updateSlide,
  uploadImages,
} from "../controllers/homeSlider.controller.js";

const homeSlidesRouter = Router();


homeSlidesRouter.post("/uploadImages", auth, upload.array("images"), uploadImages);
homeSlidesRouter.post("/add", auth, addHomeSlide);
homeSlidesRouter.get("/", getHomeSlides);
homeSlidesRouter.get("/:id", getSingleHomeSlide);
homeSlidesRouter.delete("/deleteImage", auth, removeImageFromCloudinary);
homeSlidesRouter.post("/deleteMultiple", auth, deleteMultipleSlides);
homeSlidesRouter.delete("/:id", auth, deleteSlide);
homeSlidesRouter.put("/:id", auth, updateSlide);

export default homeSlidesRouter;