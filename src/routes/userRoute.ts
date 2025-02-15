import express from 'express'
import { authentication, changePicture, createUser, deleteUser, editUser, getAllusers, getUserById } from '../controllers/userController';
import { verifyAddUser, verifyEditUser } from '../middlewares/verifyUser';
import uploadFile from '../middlewares/uploadProfile';
import { verifyAuthtentication } from '../middlewares/userValidation';
import { verifyRole, verifyToken } from '../middlewares/authorization';

const app = express()
app.use(express.json())

app.get('/', [verifyToken, verifyRole(["Manager"])], getAllusers)
app.post('/', [verifyToken, verifyRole(["Manager"]), uploadFile.single("picture"), verifyAddUser], createUser)
app.delete('/:id', [verifyToken, verifyRole(["Cashier", "Manager"])], deleteUser)
app.get('/:id', [verifyToken, verifyRole(["Cashier", "Manager"])], getUserById)
app.put('/:id', [verifyToken, verifyRole(["Cashier", "Manager"]), uploadFile.single("picture"),], verifyEditUser, editUser)
app.put('/pic/:id', [verifyToken, verifyRole(["Cashier", "Manager"]), uploadFile.single("picture")], changePicture)
app.post('/login', [verifyAuthtentication], authentication)

export default app
