import express from 'express'
import { createUser, deleteUser, editUser, getAllusers, getUserById } from '../controllers/userController';
import { verifyAddUser, verifyEditUser } from '../middlewares/verifyUser';

const app = express()
app.use(express.json())

app.get('/', getAllusers)
app.post('/', [verifyAddUser], createUser)
app.put('/:id', [verifyEditUser], editUser)
app.delete('/:id', deleteUser)
app.get('/:id', getUserById)

export default app
