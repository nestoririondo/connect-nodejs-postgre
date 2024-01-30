import pool from "../db/pool.js";

export const getOrders = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM orders");
    res.status(200).json(rows);
  } catch (error) {
    res.status(404).json(error.message);
  }
};

export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM orders WHERE id=$1", [id]);
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(404).json(error.message);
  }
};

export const postOrder = async (req, res) => {
  try {
    const { price, date, user_id } = req.body;
    const { rows } = await pool.query(
      "INSERT INTO orders (price, date, user_id) VALUES ($1, $2, $3) RETURNING *",
      [price, date, user_id]
    );
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(404).json(error.message);
  }
};

export const putOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { price, date, user_id } = req.body;
    const { rows } = await pool.query(
      "UPDATE orders SET price = $1, date = $2, user_id = $3 WHERE id=$4 RETURNING *",
      [price, date, user_id, id]
    );
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(404).json(error.message);
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("DELETE FROM orders WHERE id=$1 RETURNING *", [id]);
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(404).json(error.message);
  }
};
