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
            status: true,
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
