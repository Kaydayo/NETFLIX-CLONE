import express, { Request, Response, NextFunction } from 'express';
import User from '../models/modelUser';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { validateRegister, validateLogin } from '../utils/validator';
import { sendFailedResponse, sendSuccessResponse } from '../utils/response';
import jwt from 'jsonwebtoken'

dotenv.config()



export const register = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = validateRegister(req.body)
    if (error) {
        let errmsg = error.details[0].message
        let mymsg = errmsg.replace(/\\/g, ' ')
        return sendFailedResponse(res,mymsg,'invalid input');
    }
    try {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10)
        })
        const user = await newUser.save()
        return sendSuccessResponse(res, user, 'successfully created')
    } catch (error) {
        return sendFailedResponse(res, error, 'an error occurred')
    }

}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { error } = validateLogin(req.body)
        if (error) {
            let errmsg = error.details[0].message
            let mymsg = errmsg.replace(/\\/g, ' ')
            return sendFailedResponse(res, mymsg, 'invalid input')
        }
        const findUser = await User.findOne({ email: req.body.email })
        if (!findUser) {
            return sendFailedResponse(res, 'invalid credentials', 'wrong email or password')
        }
        const validPass = await bcrypt.compare(req.body.password, findUser?.password)
        if(!validPass){
            return sendFailedResponse(res, 'invalid credentials', 'wrong email or password')
        }
        const accessToken = jwt.sign(
            {email: req.body.email},
            process.env.SECRET as string
        )

        const {password, ...otherUser} = findUser._doc 
        return sendSuccessResponse(res, {user:otherUser, accessToken}, 'logged in successfully')

    } catch (error) {
        return res.status(500).json({ success: false, error: 'user can\'t be found', message: 'user does not exist' })
    }
}