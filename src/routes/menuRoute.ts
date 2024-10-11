import express from 'express'
import { getAllMenus, createMenu, editMenu, deleteMenu, getTotalMenus, getMenuById, changePicture } from '../controllers/menuController';
import { verifyAddMenu, verifyeditMenu } from '../middlewares/verifyMenu';
import { verifyRole, verifyToken } from '../middlewares/authorization';
import uploadFile from '../middlewares/uploadMenu';

const app = express()
app.use(express.json())

app.get('/', [verifyToken, verifyRole(["Cashier", "Manager"])], getAllMenus)
app.get('/total', [verifyToken, verifyRole(["Manager"])], getTotalMenus)
app.get('/:id', [verifyToken, verifyRole(["Manager"])], getMenuById)
app.post('/', [verifyToken, verifyRole(["Manager"]), verifyAddMenu], createMenu)
app.delete('/:id', [verifyToken, verifyRole(["Manager"])], deleteMenu)
app.put('/:id', [verifyToken, verifyRole(["Manager"]), verifyeditMenu], editMenu)
app.put('/pic/:id', [verifyToken, verifyRole(["Manager"]), uploadFile.single("picture")], changePicture)

export default app