import { Router } from "express";
import auth from "../middlewares/auth.js";
import {
  addAddressController,
  getAddressController,
  deleteAddressController,
  getSingleAddressController,
  editAddress
} from "../controllers/address.controller.js";

const addressRouter = Router();

addressRouter.post("/addAddress", auth, addAddressController);
addressRouter.get("/get", auth, getAddressController);
addressRouter.get("/:id", auth, getSingleAddressController);
addressRouter.delete("/delete/:addressId", auth , deleteAddressController);
addressRouter.put("/:id", auth, editAddress);


export default addressRouter;
