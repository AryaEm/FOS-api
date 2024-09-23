import { Request, Response } from "express"; //untuk mengimport express
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const getAllMenus = async (req: Request, res: Response) => {
    try {
        const { search } = req.query //input
        const allMenus = await prisma.menu.findMany({                  //
            where: { name: { contains: search?.toString() || "" } }    // Main
        })                                                             //
        return res.json({ //output                
            status: 'Nih Menunya',
            data: allMenus,
            massege: 'Menus has retrieved'
        }).status(200)
    } catch (error) {
        return res
            .json({
                status: false,
                message: `Error bang ${error}`
            })
            .status(400)
    }
}

export const createMenu = async (req: Request, res: Response) => {
    try {
        //mengambil data
        const { name, price, category, description } = req.body
        const uuid = uuidv4()

        //proses save data
        const newMenu = await prisma.menu.create({
            data: { uuid, name, price: Number(price), category, description }
        })

        return res.json({
            status: 'Alhamdulillah ga error',
            data: newMenu,
            message: 'New menu has created'
        }).status(200)
    } catch (error) {
        return res
            .json({
                status: false,
                message: `error lee ${error}`
            })
            .status(400)
    }
}

export const editMenu = async (req: Request, res: Response) => {
    try {
        const { id } = req.params //Memilih id dari menu yang ingin di edit melalui parameter
        const { name, price, category, description } = req.body

        const findMenu = await prisma.menu.findFirst({ where: { id: Number(id) } })
        if (!findMenu) return res
            .status(200)
            .json({
                status: false,
                message: "Menu tidak ada"
            })

        const editedMenu = await prisma.menu.update({
            data: {
                name: name || findMenu.name,
                price: price ? Number(price) : findMenu.price,
                category: category || findMenu.category,
                description: description || findMenu.description
            },
            where: { id: Number(id) }
        })

        return res.json({
            status: 'alhamdulillah ga error',
            data: editedMenu,
            message: 'Menu sudah diupdate'
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