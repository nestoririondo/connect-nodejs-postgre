import express from "express";
import {
  getOrders,
  getOrder,
  postOrder,
  putOrder,
  deleteOrder,
  orderValidator,
} from "../controllers/orders.js";

const ordersRouter = express.Router();

ordersRouter.get("/", getOrders);
ordersRouter.get("/:id", getOrder);
ordersRouter.post("/", orderValidator(), postOrder);
ordersRouter.put("/:id", orderValidator(), putOrder);
ordersRouter.delete("/:id", deleteOrder);

export default ordersRouter;
