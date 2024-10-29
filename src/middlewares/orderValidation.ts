import { NextFunction, Request, Response } from "express"
import Joi from "joi"

const orderListSchema = Joi.object({
    menuId: Joi.number().required(),
    quantity: Joi.number().required(),
    note: Joi.string().optional()
})

const addDataSchema = Joi.object({
    customer: Joi.string().required(),
    table_number: Joi.number().min(0).required(),
    payment_method: Joi.string().valid("Cash", "Qris").required(),
    status: Joi.string().valid("New", "paid", "Done").required(),
    idUser: Joi.number().optional(),
    order_list: Joi.array().items(orderListSchema).min(1).required(),
    user: Joi.optional()
})

export const verifyAddOrder = (req: Request, res: Response, next: NextFunction) => {
    const { error } = addDataSchema.validate(req.body, { abortEarly: false })


    if (error) {
        return res.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}

const editDataSchema = Joi.object({
    status: Joi.string().valid("New", "Paid", "Done").required(),
    user: Joi.optional()
})

export const verifyEditStatus = (req: Request, res: Response, next: NextFunction) => {
    const { error } = editDataSchema.validate(req.body, { abortEarly: false })


    if (error) {
        return res.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
    }
    return next()
}
