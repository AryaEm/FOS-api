import { Request, Response } from "express" //untuk mengimport express
import { PrismaClient } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"
import { BASE_URL } from "../global"
import fs from "fs"

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const getAllMenus = async (req: Request, res: Response) => {
    try {
        const { search } = req.query //input
        const allMenus = await prisma.menu.findMany({                  //
            where: { name: { contains: search?.toString() || "" } }    // Main
        })                                                             //
        return res.json({ //output                
            status: 'Nih Menunya',
            menu: allMenus,
            massage: 'Menus has retrieved'
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

export const changePicture = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const findMenu = await prisma.menu.findFirst({ where: { id: Number(id) } })
        if (!findMenu) return res
            .status(200)
            .json({
                message: 'Menu tidak ada',
            })

        // DEFAULT VALUE FILENAME OF SAVED DATA
        let filename = findMenu.picture
        if (req.file) {
            filename = req.file.filename // UPDATE NAMA FILE SESUAI GAMBAR YANG DIUPLOAD

            let path = `${BASE_URL}/../public/menuPicture/${findMenu.picture}` // CEK FOTO LAMA PADA FOLDER
            let exist = fs.existsSync(path)

            if (exist && findMenu.picture !== ``) fs.unlinkSync(path) //MENGHAPUS FOTO LAMA JIKA ADA
        }

        const updatePicture = await prisma.menu.update({
            data: { picture: filename },
            where: { id: Number(id) }
        })
        return res.json({
            status: 'tru',
            data: updatePicture,
            message: 'Picture telah diganti'
        })

    } catch (error) {
        return res.json({
            status: 'fals',
            error: `${error}`
        }).status(400)
    }
}


export const deleteMenu = async (req: Request, res: Response) => {
    try {
        const { id } = req.params //Memilih id dari menu yang ingin di hapus melalui parameter

        // Mencari menu berdasarkan id
        const findMenu = await prisma.menu.findFirst({ where: { id: Number(id) } });
        if (!findMenu) {
            return res.status(404).json({
                status: 'error lee',
                message: "Menu tidak ditemukan"
            });
        }

        let path = `${BASE_URL}/../public/menuPicture/${findMenu.picture}`
        let exist = fs.existsSync(path)
        if (exist && findMenu.picture !== ``) fs.unlinkSync(path)

        // Menghapus menu
        await prisma.menu.delete({
            where: { id: Number(id) }
        });

        return res.json({
            status: 'Alhamdulillah ga error',
            message: 'Menu telah dihapus'
        }).status(200);
    } catch (error) {
        return res
            .json({
                status: false,
                message: `Error saat menghapus menu ${error}`
            })
            .status(400);
    }
}

export const getTotalMenus = async (req: Request, res: Response) => {
    try {
        const total = await prisma.menu.count();
        return res.json({
            total: `Menunya ada ${total} kakk`,
        }).status(200);
    } catch (error) {
        return res
            .json({
                status: false,
                message: `duh error ${error}`
            })
            .status(400);
    }
}

export const getMenuById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const menu = await prisma.menu.findFirst({ where: { id: Number(id) } });
        if (!menu)
            return res.status(404).json({
                status: false,
                message: "Menu tidak ditemukan"
            });

        return res.json({
            status: 'Nih Menu',
            data: menu,
            message: 'Detail menu berhasil diambil'
        }).status(200);
    } catch (error) {
        return res
            .json({
                status: false,
                message: `Error: ${error}`
            })
            .status(400);
    }
}
