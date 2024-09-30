import express from 'express'
import { getAllOrders } from '../controllers/orderController'

const app = express()
app.use(express.json())

app.get('/', getAllOrders)

export default app