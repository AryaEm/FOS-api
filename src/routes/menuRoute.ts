import express from 'express'
import { getAllMenus, createMenu, editMenu } from '../controllers/menuController';
import { verifyAddMenu, verifyeditMenu } from '../middlewares/verifyMenu';

const app = express()
app.use(express.json())

app.get('/', getAllMenus)
app.post('/', [verifyAddMenu], createMenu)
app.put('/:id', [verifyeditMenu], editMenu)

export default app