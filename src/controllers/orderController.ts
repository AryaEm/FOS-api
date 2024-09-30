import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const { search } = req.query
        const allOrder = await prisma.order.findMany({
            where: { customer : { contains: search?.toString() || "" } }
        })
        return res.json({
            status: 'wow',
            Order: allOrder,
            massage: 'Orders has retrieved'
        }).status(200)
    } catch (error) {
        return res
            .json({
                status: 'error le',
                message: `${error}`
            })
            .status(400)
    }
}