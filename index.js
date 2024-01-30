import express from "express";
import usersRouter from './routes/users.js';
import ordersRouter from './routes/orders.js';

const app = express();
const port = 3003;

app.use(express.json());

app.use("/users", usersRouter);
app.use("/orders", ordersRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
