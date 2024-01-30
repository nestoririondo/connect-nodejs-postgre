import pool from "../db/pool.js";
import { body, validationResult } from "express-validator";

export const orderValidator = () => [
  body("date").notEmpty().isISO8601(),
  body("user_id").notEmpty().isNumeric(),
  body("price").notEmpty().isNumeric(),
];

export const getOrders = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM orders");
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getOrder = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Missing id parameter" });
  }

  try {
    const { rows } = await pool.query("SELECT * FROM orders WHERE id=$1", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const postOrder = async (req, res) => {
  const { price, date, user_id } = req.body;
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.send({ errors: result.array() });
  }

  try {
    const { rows } = await pool.query(
      "INSERT INTO orders (price, date, user_id) VALUES ($1, $2, $3) RETURNING *",
      [price, date, user_id]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const putOrder = async (req, res) => {
  const { id } = req.params;
  const { price, date, user_id } = req.body;
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.send({ errors: result.array() });
  }

  try {
    const { rows } = await pool.query(
      "UPDATE orders SET price = $1, date = $2, user_id = $3 WHERE id=$4 RETURNING *",
      [price, date, user_id, id]
    );
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Missing id parameter" });
  }
  try {
    const { rows } = await pool.query(
      "DELETE FROM orders WHERE id=$1 RETURNING *",
      [id]
    );
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
