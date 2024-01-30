import pool from "../db/pool.js";
import { validationResult } from "express-validator";

export const getUsers = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users");
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Missing id parameter" });
  }
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id=$1", [id]);
    if (rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const postUser = async (req, res) => {
  const { first_name, last_name, age } = req.body;
  const result = validationResult(req);
  if(!result.isEmpty()) { // means there are errors
    return res.send({ errors: result.array() });
  };

  try {
    const { rows } = await pool.query(
      "INSERT INTO users (first_name, last_name, age) VALUES ($1, $2, $3) RETURNING *",
      [first_name, last_name, age]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const putUser = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, age } = req.body;
  const result = validationResult(req);
  if(!result.isEmpty()) {
    return res.send({ errors: result.array() });
  };
  if (!id) {
    return res.status(400).json({ message: "Missing id parameter" });
  }

  try {
    const { rows } = await pool.query(
      "UPDATE users SET first_name = $1, last_name = $2, age = $3 WHERE id=$4 RETURNING *",
      [first_name, last_name, age, id]
    );
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Missing id parameter" });
  }

  try {
    const { rows } = await pool.query(
      "DELETE FROM users WHERE id=$1 RETURNING *",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserOrders = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Missing id parameter" });
  }

  try {
    const { rows } = await pool.query(
      // "SELECT o.* FROM orders o INNER JOIN users u on o.user_id = u.id WHERE u.id = $1",
      "SELECT * FROM orders WHERE user_id = $1",
      [id]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// The hard solution
export const putUserInactive = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Missing id parameter" });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE users 
         SET active = false 
         WHERE id = $1 AND NOT EXISTS (SELECT * FROM orders WHERE user_id = users.id) 
         RETURNING *`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// The easy solution
export const putUserInactive2 = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Missing id parameter" });
  }
  
  try {
    const { orders } = await pool.query(
      `SELECT * FROM orders WHERE user_id = $1`,
      [id]
    );
    if (orders.length > 0) {
      res.status(400).json({ message: "User has orders" });
    } else {
      const { rows } = await pool.query(
        `UPDATE users
           SET active = false
           WHERE id = $1
           RETURNING *`,
        [id]
      );
      if (rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(rows[0]);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
