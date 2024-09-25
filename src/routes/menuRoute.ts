import express from 'express'
import { getAllMenus, createMenu, editMenu, deleteMenu } from '../controllers/menuController';
import { verifyAddMenu, verifyeditMenu } from '../middlewares/verifyMenu';

const app = express()
app.use(express.json())

app.get('/', getAllMenus)
app.post('/', [verifyAddMenu], createMenu)
app.put('/:id', [verifyeditMenu], editMenu)
app.delete('/:id', deleteMenu)

export default app