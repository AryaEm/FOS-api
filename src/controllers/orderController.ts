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
            include: {
                orderList: {
                    include: {
                        menu: {
                            select: {
                                name: true // Tambahkan ini untuk hanya mengambil nama menu
                            }
                        }
                    }
                }
            }
        });

        const modifiedOrders = allOrders.map(order => ({
            ...order,
            orderList: order.orderList.map(({ menu, ...item }) => ({
                ...item,
                Item: menu?.name || null // Tambahkan properti Item
            }))
        }));

        return response.status(200).json({
            status: true,
            data: modifiedOrders,
            message: `Order list has been retrieved`
        });
    } catch (error) {
        return response.status(400).json({
            status: false,
            message: `There is an error. ${error}`
        });
    }
};



export const createOrder = async (req: Request, res: Response) => {
    try {
        const { customer, table_number, payment_method, status, orderlists } = req.body;

        if (!customer || !table_number || !payment_method || !orderlists || !orderlists.length) {
            return res.status(400).json({ status: false, message: "All fields are required" });
        }

        let total_price = 0;
        const orderItems = [];

        for (const order of orderlists) {
            const menu = await prisma.menu.findUnique({ where: { id: order.menuId } });
            if (!menu) {
                return res.status(404).json({ status: false, message: `Menu with id ${order.menuId} not found` });
            }
            total_price += menu.price * order.quantity;
            orderItems.push({
                uuid: uuidv4(),
                quantity: order.quantity,
                note: order.note,
                idMenu: order.menuId,
            });
        }

        const newOrder = await prisma.order.create({
            data: {
                uuid: uuidv4(),
                customer,
                table_number,
                total_price,
                payment_method,
                status: "New",
                orderList: { create: orderItems },
            },
            include: { orderList: true },
        });

        res.status(201).json({
            status: true,
            data: newOrder,
            message: "New Order has been created",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};


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
