import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient({ errorFormat: "pretty" });

// export const getAllOrders = async (request: Request, response: Response) => {
//     try {
//         const { search, status, start_date, end_date } = request.query

//         const allOrders = await prisma.order.findMany({
//             where: {
//                 OR: [
//                     { customer: { contains: search?.toString() || "" } },
//                     { table_number: { contains: search?.toString() || "" } }
//                 ]
//             },
//             orderBy: { createdAt: "desc" },
//             include: { orderList: true }
//         })

//         return response.json({
//             status: true,
//             data: allOrders,
//             message: `Order list has retrieved`
//         }).status(200)
//     } catch (error) {
//         return response
//             .json({
//                 status: false,
//                 message: `There is an error. ${error}`
//             })
//             .status(400)
//     }
// }

export const getAllOrders = async (request: Request, response: Response) => {
    try {
        const { search, status, start_date, end_date } = request.query;

        const filterConditions: any = {
            OR: [
                { customer: { contains: search?.toString() || "" } },
                { table_number: { contains: search?.toString() || "" } }
            ]
        };

        if (status) {
            filterConditions.status = status.toString();
        }

        if (start_date && end_date) {
            filterConditions.createdAt = {
                gte: new Date(start_date.toString()),
                lte: new Date(end_date.toString())
            };
        }

        const allOrders = await prisma.order.findMany({
            where: filterConditions,
            orderBy: { createdAt: "desc" },
            include: { orderList: true }
        });

        return response.json({
            status: true,
            data: allOrders,
            message: `Order list has been retrieved`
        }).status(200);
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400);
    }
};


export const createOrder = async (request: Request, response: Response) => {
    try {
        const { customer, table_number, payment_method, status, order_list } = request.body
        const user = request.body.user
        const uuid = uuidv4()

        let total_price = 0
        for (let index = 0; index < order_list.length; index++) {
            const { menuId } = order_list[index]
            const detailMenu = await prisma.menu.findFirst({
                where: {
                    id: menuId
                }
            })
            if (!detailMenu) return response
                .status(200).json({ status: false, message: `Menu with id ${menuId} is not found` })
            total_price += (detailMenu.price * order_list[index].quantity)
        }

        const newOrder = await prisma.order.create({
            data: { uuid, customer, table_number, total_price, payment_method, status, idUser: user.id }
        })

        for (let index = 0; index < order_list.length; index++) {
            const uuid = uuidv4()
            const { menuId, quantity, note } = order_list[index]
            await prisma.order_List.create({
                data: {
                    uuid, idOrder: newOrder.id, idMenu: Number(menuId), quantity: Number(quantity), note
                }
            })
        }
        return response.json({
            status: true,
            data: newOrder,
            message: `New Order has created`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}

export const updateStatusOrder = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { status } = req.body

        const findOrder = await prisma.order.findFirst({ where: { id: Number(id) } })
        if (!findOrder) return res
            .status(200)
            .json({
                status: false,
                message: "order tidak ada"
            })

        const editedUser = await prisma.order.update({
            data: {
                status: status || findOrder.status
            },
            where: { id: Number(id) }
        })

        return res.json({
            status: 'alhamdulillah ga error',
            user: editedUser,
            message: 'user telah diupdate'
        }).status(200)
    } catch (error) {
        return res
            .json({
                status: 'yek error',
                message: `error lee ${error}`
            })
            .status(400)
    }
}

export const deleteOrder = async (request: Request, response: Response) => {
    try {
        const { id } = request.params

        const findOrder = await prisma.order.findFirst({ where: { id: Number(id) } })
        if (!findOrder) return response
            .status(200)
            .json({ status: false, message: `Order is not found` })

        let deleteOrderList = await prisma.order_List.deleteMany({ where: { idOrder: Number(id) } })
        let deleteOrder = await prisma.order.delete({ where: { id: Number(id) } })


        return response.json({
            status: true,
            data: deleteOrder,
            message: `Order has deleted`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}
