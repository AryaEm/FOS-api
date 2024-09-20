import { NextFunction, Request, Response } from "express";
import Joi from 'joi'

//Membuat schema sata menambah data menu
const addDataSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().min(0).required(),
    category: Joi.string().required(),
    description: Joi.string().required(),
    picture: Joi.allow().optional(),
})

export const verifyAddMenu = (req: Request, res: Response, next: NextFunction) => {
    //memvalidasi request body dan mengambil error 
    const { error } = addDataSchema.validate(req.body, { abortEarly: false })

    if (error) {
        //response jika ada error
        return res.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}