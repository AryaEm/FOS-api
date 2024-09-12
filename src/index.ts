import express from 'express'
import cors from 'cors'

const PORT: number = 8000
const app = express()
app.use(cors())

app.listen(PORT, () => {
    console.log(`[server]: server is running on Port 8000`)
})  