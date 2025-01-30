import express from 'express'
import { getAllMenus, createMenu, editMenu, deleteMenu, getTotalMenus, getMenuById, } from '../controllers/menuController';
import { verifyAddMenu, verifyeditMenu } from '../middlewares/verifyMenu';
import { verifyRole, verifyToken } from '../middlewares/authorization';
import uploadFile from '../middlewares/uploadMenu';

const app = express()
app.use(express.json())

app.get('/', [verifyToken, verifyRole(["Cashier", "Manager"])], getAllMenus)
app.get('/total', [verifyToken, verifyRole(["Manager"])], getTotalMenus)
app.get('/:id', [verifyToken, verifyRole(["Manager"])], getMenuById)
app.post('/', [verifyToken, verifyRole(["Manager"]), uploadFile.single("picture"), verifyAddMenu], createMenu)
app.put('/:id', [verifyToken, verifyRole(["Manager"]), uploadFile.single("picture"), verifyeditMenu], editMenu)
// app.put('/pic/:id', [verifyToken, verifyRole(["Manager"]), uploadFile.single("picture")], changePicture)
app.delete('/:id', [verifyToken, verifyRole(["Manager"])], deleteMenu)

export default app