import express from 'express'
import { authentication, changePicture, createUser, deleteUser, editUser, getAllusers, getUserById } from '../controllers/userController';
import { verifyAddUser, verifyEditUser } from '../middlewares/verifyUser';
import uploadFile from '../middlewares/uploadProfile';
import { verifyAuthtentication } from '../middlewares/userValidation';

const app = express()
app.use(express.json())

app.get('/', getAllusers)
app.post('/', [verifyAddUser], createUser)
app.delete('/:id', deleteUser)
app.get('/:id', getUserById)
app.put('/:id', [verifyEditUser], editUser)
app.put('/pic/:id', [uploadFile.single("picture")], changePicture)
app.post('/login', [verifyAuthtentication], authentication)

export default app
