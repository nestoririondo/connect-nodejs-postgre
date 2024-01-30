import express from "express";
import {
  getUsers,
  getUser,
  postUser,
  putUser,
  deleteUser,
  getUserOrders,
  putUserInactive,
} from "../controllers/users.js";
import { body } from "express-validator";

const usersRouter = express.Router();

const userValidator = () => [
  body("first_name").notEmpty().isString().trim().escape(),
  body("last_name").notEmpty().isString().trim().escape(),
  body("age")
    .notEmpty()
    .isInt()
    .custom((age) => {
      if (typeof age !== "number") {
        return new Error("Please input integer as a numeric.");
      }
      return true;
    }),
];

usersRouter.get("/", getUsers);
usersRouter.get("/:id", getUser);
usersRouter.post("/", userValidator(), postUser);
usersRouter.put("/:id", userValidator(), putUser);
usersRouter.delete("/:id", deleteUser);
usersRouter.get("/:id/orders", getUserOrders);
usersRouter.put("/:id/check-inactive", putUserInactive);

export default usersRouter;
