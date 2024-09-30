import express from 'express'
import { getAllMenus, createMenu, editMenu, deleteMenu, getTotalMenus, getMenuById, changePicture } from '../controllers/menuController';
import { verifyAddMenu, verifyeditMenu } from '../middlewares/verifyMenu';
import uploadFile from '../middlewares/uploadMenu';

const app = express()
app.use(express.json())

app.get('/', getAllMenus)
app.get('/total', getTotalMenus)
app.get('/:id', getMenuById)
app.post('/', [verifyAddMenu], createMenu)
app.put('/:id', [verifyeditMenu], editMenu)
app.put('/pic/:id', [uploadFile.single("picture")], changePicture)
app.delete('/:id', deleteMenu)

export default app