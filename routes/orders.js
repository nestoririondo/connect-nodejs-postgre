import express from "express";
import {
  getOrders,
  getOrder,
  postOrder,
  putOrder,
  deleteOrder,
} from "../controllers/orders.js";
import { body } from "express-validator";

const ordersRouter = express.Router();

const orderValidator = () => [
  body("date").notEmpty().isISO8601(),
  body("user_id").notEmpty().isNumeric(),
  body("price").custom((value) => {
    if (typeof value !== "number") {
      throw new Error("Price must be a numeric number");
    }
    return true;
  }),
];

ordersRouter.get("/", getOrders);
ordersRouter.get("/:id", getOrder);
ordersRouter.post("/", orderValidator(), postOrder);
ordersRouter.put("/:id", orderValidator(), putOrder);
ordersRouter.delete("/:id", deleteOrder);

export default ordersRouter;
