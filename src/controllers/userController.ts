import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { BASE_URL, SECRET } from "../global"
import fs from "fs"
import md5 from "md5"
import { sign, } from "jsonwebtoken";

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const getAllusers = async (req: Request, res: Response) => {
    try {
        const { search } = req.query
        const allUsers = await prisma.user.findMany({
            where: { name: { contains: search?.toString() || "" } }
        })
        return res.json({
            status: true,
            user: allUsers,
            massage: 'Users has retrieved'
        }).status(200)
    } catch (error) {
        return res
            .json({
                status: false,
                message: `${error}`
            })
            .status(400)
    }
}

export const createUser = async (req: Request, res: Response) => {
    try {
        //mengambil data
        const { name, email, password, role, profile_picture } = req.body
        const uuid = uuidv4()

        const cekEmail = await prisma.user.findUnique({
            where: { email },
        });

        if (cekEmail) {
            return res.status(400).json({
                status: false,
                message: 'Email sudah digunakan',
            });
        }

        //proses save data
        const newUser = await prisma.user.create({
            data: { uuid, name, email, password: md5(password), role, profile_picture }
        })

        return res.json({
            status: true,
            user: newUser,
            message: 'New user has created'
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


export const editUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { name, email, password, role, profile_picture } = req.body

        const findUSer = await prisma.user.findFirst({ where: { id: Number(id) } })
        if (!findUSer) return res
            .status(200)
            .json({
                status: false,
                message: "User tidak ada"
            })

        const editedUser = await prisma.user.update({
            data: {
                name: name || findUSer.name,
                email: email || findUSer.email,
                password: password ? md5(password) : findUSer.password,
                role: role || findUSer.role,
                profile_picture: profile_picture || findUSer.profile_picture
            },
            where: { id: Number(id) }
        })

        return res.json({
            status: true,
            user: editedUser,
            message: 'user telah diupdate'
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


export const changePicture = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const findUser = await prisma.user.findFirst({ where: { id: Number(id) } })
        if (!findUser) return res
            .status(200)
            .json({ message: 'USer tidak ada', })

        // DEFAULT VALUE FILENAME OF SAVED DATA
        let filename = findUser.profile_picture
        if (req.file) {
            filename = req.file.filename // UPDATE NAMA FILE SESUAI GAMBAR YANG DIUPLOAD

            let path = `${BASE_URL}/../public/userPicture/${findUser.profile_picture}` // CEK FOTO LAMA PADA FOLDER
            let exist = fs.existsSync(path)

            if (exist && findUser.profile_picture !== ``) fs.unlinkSync(path) //MENGHAPUS FOTO LAMA JIKA ADA
        }

        const updatePicture = await prisma.user.update({
            data: { profile_picture: filename },
            where: { id: Number(id) }
        })
        return res.json({
            status: true,
            data: updatePicture,
            message: 'Picture telah diganti'
        })

    } catch (error) {
        return res.json({
            status: false,
            error: `${error}`
        }).status(400)
    }
}


export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const findUser = await prisma.user.findFirst({ where: { id: Number(id) } });
        if (!findUser) {
            return res.status(404).json({
                status: false,
                message: "user tidak ditemukan"
            });
        }

        let path = `${BASE_URL}/../public/menuPicture/${findUser.profile_picture}`
        let exist = fs.existsSync(path)
        if (exist && findUser.profile_picture !== ``) fs.unlinkSync(path)


        await prisma.user.delete({
            where: { id: Number(id) }
        });

        return res.json({
            status: true,
            message: 'User telah dihapus'
        }).status(200);
    } catch (error) {
        return res
            .json({
                status: false,
                message: `${error}`
            })
            .status(400);
    }
}

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findFirst({ where: { id: Number(id) } });
        if (!user)
            return res.status(404).json({
                status: "User tidak ditemukan"
            });

        return res.json({
            status:true,
            user: user,
            message: 'Detail User berhasil diambil'
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

export const authentication = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        const findUSer = await prisma.user.findFirst({
            where: { email, password: md5(password) }
        })

        if (!findUSer)
            return res
                .status(200)
                .json({
                    status: false,
                    logged: false,
                    message: 'email or password is invalid'
                })

        let data = {
            id: findUSer.id,
            name: findUSer.name,
            email: findUSer.email,
            role: findUSer.role,
        }

        let playload = JSON.stringify(data) // MENYIAPKAN DATA YANG AKAN DIJADIKAN TOKEN

        let token = sign(playload, SECRET || "token") //UNTUK MENGGENERATE TOKEN (SIGN)

        return res
            .status(200)
            .json({
                status: true,
                logged: true,
                message: "Login Succes",
                token,
                data: data
            })

    } catch (error) {
        return res
            .json({
                status: false,
                message: `error ${error}`
            })
            .status(400)
    }
}

