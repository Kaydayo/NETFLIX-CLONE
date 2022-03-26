import express, {Request, Response, NextFunction} from 'express';
import User from '../models/modelUser';
import dotenv from 'dotenv'
import Cryptojs from 'crypto-js'

dotenv.config()


export const register = async (req:Request, res:Response, next:NextFunction)=>{
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET as string).toString()
    })

    try {
        const user = await newUser.save()
        return res.status(201).json({payload:user, message:'successfully created'})
    } catch (error) {
        return res.status(500).json({error, message:'an error occurred'})
    }
}