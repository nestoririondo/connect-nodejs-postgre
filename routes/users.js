import express from "express";
import {
  getUsers,
  getUser,
  postUser,
  putUser,
  deleteUser,
  getUserOrders,
  putUserInactive,
  userValidator,
} from "../controllers/users.js";

const usersRouter = express.Router();

usersRouter.get("/", getUsers);
usersRouter.get("/:id", getUser);
usersRouter.post("/", userValidator(), postUser);
usersRouter.put("/:id", userValidator(), putUser);
usersRouter.delete("/:id", deleteUser);
usersRouter.get("/:id/orders", getUserOrders);
usersRouter.put("/:id/check-inactive", putUserInactive);

export default usersRouter;
