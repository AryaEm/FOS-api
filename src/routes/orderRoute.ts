import express from "express"
import { getAllOrders, createOrder, updateStatusOrder, deleteOrder } from "../controllers/orderController"
import { verifyAddOrder, verifyEditStatus } from "../middlewares/orderValidation"
import { verifyRole, verifyToken } from "../middlewares/authorization"


const app = express()
app.use(express.json())
app.get(`/`, [verifyToken, verifyRole(["Cashier","Manager"])], getAllOrders)
app.post(`/`, [verifyAddOrder], createOrder)
app.put(`/:id`, [verifyToken, verifyRole(["Cashier"]), verifyEditStatus], updateStatusOrder)
app.delete(`/:id`, [verifyToken, verifyRole(["Manager"])], deleteOrder)


export default app