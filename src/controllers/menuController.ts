import { Request, Response } from "express" //untuk mengimport express
import { menu, PrismaClient } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"
import { BASE_URL } from "../global"
import fs from "fs"
import { Category } from "@prisma/client";

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const getAllMenus = async (req: Request, res: Response) => {
    try {
        /** get requested data (data has been sent from request) */
        const { search } = req.query

        /** process to get menu, contains means search name of menu based on sent keyword */
        const allMenus = await prisma.menu.findMany({
            where: { name: { contains: search?.toString() || "" } }
        })

        // const formattedMenus = allMenus.map(menu => ({
        //     ...menu,
        //     price: menu.price.toString().slice(0,2)
        // }));

        return res.json({
            status: true,
            data: allMenus,
            message: `Menus has retrieved`
        }).status(200)
    } catch (error) {
        return res
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400)
    }
}

// export const getMenuCategories = async (req: Request, res: Response) => {
//     try {
//         // Ambil daftar kategori menu yang unik dari database
//         const categories = await prisma.menu.findMany({
//             select: { category: true }
//         });

//         // Filter unique category
//         const uniqueCategories = [...new Set(categories.map(item => item.category))];

//         return res.status(200).json({
//             status: true,
//             data: uniqueCategories,
//             message: "Menu categories have been retrieved"
//         });
//     } catch (error) {
//         return res.status(500).json({
//             status: false,
//             message: `There is an error. ${error}`
//         });
//     }
// };

export const createMenu = async (req: Request, res: Response) => {
    try {
        //mengambil data
        const { name, price, category, description } = req.body
        const uuid = uuidv4()

        let filename = ""
        if (req.file) filename = req.file.filename

        //proses save data
        const newMenu = await prisma.menu.create({
            data: { uuid, name, price: Number(price), category, description, picture: filename }
        })

        return res.json({
            status: true,
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

        let filename = findMenu.picture
        if (req.file) {
            filename = req.file.filename // UPDATE NAMA FILE SESUAI GAMBAR YANG DIUPLOAD

            let path = `${BASE_URL}/../public/menuPicture/${findMenu.picture}` // CEK FOTO LAMA PADA FOLDER
            let exist = fs.existsSync(path)

            if (exist && findMenu.picture !== ``) fs.unlinkSync(path) //MENGHAPUS FOTO LAMA JIKA ADA
        }

        const editedMenu = await prisma.menu.update({
            data: {
                name: name || findMenu.name,
                price: price ? Number(price) : findMenu.price,
                category: category || findMenu.category,
                description: description || findMenu.description,
                picture: filename
            },
            where: { id: Number(id) }
        })

        return res.json({
            status: true,
            data: editedMenu,
            message: 'Menu sudah diupdate'
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

// export const changePicture = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params

//         const findMenu = await prisma.menu.findFirst({ where: { id: Number(id) } })
//         if (!findMenu) return res
//             .status(200)
//             .json({
//                 message: 'Menu tidak ada',
//             })

//         // DEFAULT VALUE FILENAME OF SAVED DATA
//         let filename = findMenu.picture
//         if (req.file) {
//             filename = req.file.filename // UPDATE NAMA FILE SESUAI GAMBAR YANG DIUPLOAD

//             let path = `${BASE_URL}/../public/menuPicture/${findMenu.picture}` // CEK FOTO LAMA PADA FOLDER
//             let exist = fs.existsSync(path)

//             if (exist && findMenu.picture !== ``) fs.unlinkSync(path) //MENGHAPUS FOTO LAMA JIKA ADA
//         }

//         const updatePicture = await prisma.menu.update({
//             data: { picture: filename },
//             where: { id: Number(id) }
//         })
//         return res.json({
//             status: 'tru',
//             data: updatePicture,
//             message: 'Picture telah diganti'
//         })

//     } catch (error) {
//         return res.json({
//             status: 'fals',
//             error: `${error}`
//         }).status(400)
//     }
// }


export const deleteMenu = async (req: Request, res: Response) => {
    try {
        const { id } = req.params //Memilih id dari menu yang ingin di hapus melalui parameter

        // Mencari menu berdasarkan id
        const findMenu = await prisma.menu.findFirst({ where: { id: Number(id) } });
        if (!findMenu) {
            return res.status(404).json({
                status: false,
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
            status: true,
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
        return res.status(200).json({
            status: true,
            total_menu: [{ total }], // Wrap in an array of objects
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: `duh error ${error}`
        });
    }
};

// export const getMenuById = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;
//         const menuId = parseInt(id, 10); // Konversi id ke integer

//         if (isNaN(menuId)) {
//             return res.status(400).json({ status: false, message: "Invalid menu ID" });
//         }

//         const menu = await prisma.menu.findFirst({
//             where: { id: menuId }, // Pastikan id dalam bentuk integer
//         });

//         if (!menu) {
//             return res.status(404).json({ status: false, message: "Menu not found" });
//         }

//         res.status(200).json({ status: true, data: menu });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ status: false, message: "Internal Server Error" });
//     }
// };


export const getMostOrderedMenu = async (req: Request, res: Response) => {
    try {
        // Ambil semua menu dari database
        const allMenus = await prisma.menu.findMany();

        // Ambil semua pesanan dengan status "Done"
        const completedOrders = await prisma.order.findMany({
            where: { status: "Done" },
            include: { orderList: { include: { menu: true } } },
        });

        // Hitung jumlah pembelian tiap menu
        const menuCount: Record<number, { menu: menu; totalOrdered: number }> = {};
        completedOrders.forEach(order => {
            order.orderList.forEach(orderItem => {
                if (orderItem.menu) {
                    const menuId = orderItem.menu.id;
                    if (!menuCount[menuId]) {
                        menuCount[menuId] = {
                            menu: orderItem.menu,
                            totalOrdered: 0,
                        };
                    }
                    menuCount[menuId].totalOrdered += orderItem.quantity;
                }
            });
        });

        // Gabungkan semua menu dengan data pesanan
        const result = allMenus.map(menu => ({
            menu,
            totalOrdered: menuCount[menu.id]?.totalOrdered || 0,
        }));

        // Urutkan berdasarkan jumlah terbanyak
        result.sort((a, b) => b.totalOrdered - a.totalOrdered);

        res.status(200).json({
            status: true,
            data: result,
            message: "Most ordered menu retrieved successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};


export const getTopThreeMostOrderedMenu = async (req: Request, res: Response) => {
    try {
        // Ambil semua menu dari database
        const allMenus = await prisma.menu.findMany();

        // Ambil semua pesanan dengan status "Done"
        const completedOrders = await prisma.order.findMany({
            where: { status: "Done" },
            include: { orderList: { include: { menu: true } } },
        });

        // Hitung jumlah pembelian tiap menu
        const menuCount: Record<number, { menu: menu; totalOrdered: number }> = {};
        completedOrders.forEach(order => {
            order.orderList.forEach(orderItem => {
                if (orderItem.menu) {
                    const menuId = orderItem.menu.id;
                    if (!menuCount[menuId]) {
                        menuCount[menuId] = {
                            menu: orderItem.menu,
                            totalOrdered: 0,
                        };
                    }
                    menuCount[menuId].totalOrdered += orderItem.quantity;
                }
            });
        });

        // Gabungkan semua menu dengan data pesanan
        const result = allMenus.map(menu => ({
            menu,
            totalOrdered: menuCount[menu.id]?.totalOrdered || 0,
        }));

        // Urutkan berdasarkan jumlah terbanyak dan ambil 3 teratas
        const topThreeMenus = result.sort((a, b) => b.totalOrdered - a.totalOrdered).slice(0, 3);

        res.status(200).json({
            status: true,
            data: topThreeMenus,
            message: "Top 3 most ordered menu retrieved successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};



export const getMenuCategories = async (req: Request, res: Response) => {
    try {
        // Ambil daftar kategori unik dari tabel menu
        const categories = await prisma.menu.findMany({
            select: { category: true }, // Ambil hanya kolom kategori
            distinct: ["category"], // Pastikan tidak ada kategori yang duplikat
        });

        res.status(200).json({
            status: true,
            menu_categories: categories,
            message: "Menu categories retrieved successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

