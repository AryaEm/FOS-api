import express from 'express'
import cors from 'cors'
import MenuRoute from './routes/menuRoute'
import UserRoute from './routes/userRoute'
import OrderRoute from './routes/orderRoute'

const PORT: number = 8000
const app = express()
app.use(cors())

app.use('/menu', MenuRoute)
app.use('/user', UserRoute)
app.use('/order', OrderRoute)

app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`)
})