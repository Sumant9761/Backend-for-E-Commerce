import { Router } from "express";
import auth from "../middlewares/auth.js";
import {
  createOrderController,
  getOrderDetailsController,
  getTotalOrdersCountController,
  totalSalesController,
  totalUsersController,
  updateOrderStatus,
} from "../controllers/order.controller.js";

const orderRouter = Router();

orderRouter.post("/create", auth, createOrderController);
orderRouter.get("/order-list", auth, getOrderDetailsController);
orderRouter.put("/order-status/:id", auth, updateOrderStatus );
orderRouter.put("/count", auth, getTotalOrdersCountController);
orderRouter.get("/sales", auth, totalSalesController);
orderRouter.get("/users", auth, totalUsersController);

export default orderRouter;
