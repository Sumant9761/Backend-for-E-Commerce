import { Router } from "express";
import auth from "../middlewares/auth.js";
import {
  addAddressController,
  getAddressController,
  deleteAddressController
} from "../controllers/address.controller.js";

const addressRouter = Router();

addressRouter.post("/addAddress", auth, addAddressController);
addressRouter.get("/get", auth, getAddressController);
addressRouter.delete("/delete/:addressId", auth , deleteAddressController);


export default addressRouter;
