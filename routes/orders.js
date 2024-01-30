import express from 'express';
import { getOrders, getOrder, postOrder, putOrder, deleteOrder } from '../controllers/orders.js'

const ordersRouter = express.Router();

ordersRouter.get('/', getOrders)
ordersRouter.get('/:id', getOrder)
ordersRouter.post('/', postOrder)
ordersRouter.put('/:id', putOrder)
ordersRouter.delete('/:id', deleteOrder)

export default ordersRouter;
