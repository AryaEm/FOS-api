import { NextFunction, Request, Response } from "express";
import Joi from 'joi'

//Membuat schema sata menambah data 
const addDataSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid('Manager', 'Cashier').required(),
    profile_picture: Joi.allow().optional()
})

const editDataSchema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(8).optional(),
    role: Joi.string().valid('Manager', 'Cashier').optional(),
    profile_picture: Joi.allow().optional()
})

export const verifyAddUser = (req: Request, res: Response, next: NextFunction) => {
    //memvalidasi request body dan mengambil error 
    const { error } = addDataSchema.validate(req.body, { abortEarly: false })

    if (error) {
        //response jika ada error
        return res.status(200).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}

export const verifyEditUser = (req: Request, res: Response, next: NextFunction) => {
    //memvalidasi request body dan mengambil error 
    const { error } = editDataSchema.validate(req.body, { abortEarly: false })

    if (error) {
        //response jika ada error
        return res.status(200).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}
