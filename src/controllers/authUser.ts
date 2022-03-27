import express, { Request, Response, NextFunction } from 'express';
import User from '../models/modelUser';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { validateRegister, validateLogin } from '../utils/validator';
import { sendFailedResponse, sendSuccessResponse } from '../utils/response';
import jwt, { Secret } from 'jsonwebtoken'
import { CustomRequest } from '../../@types';
import config from '../utils/configs';

dotenv.config()



export const register = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = validateRegister(req.body)
    if (error) {
        let errmsg = error.details[0].message
        let mymsg = errmsg.replace(/\\/g, ' ')
        return sendFailedResponse(res,mymsg,'invalid input',403);
    }
    try {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, config.myhashlengthjwttoken)
        })
        const user = await newUser.save()
        return sendSuccessResponse(res, user, 'successfully created', 201)
    } catch (error) {
        return sendFailedResponse(res, error, 'an error occurred', 500)
    }

}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { error } = validateLogin(req.body)
        if (error) {
            let errmsg = error.details[0].message
            let mymsg = errmsg.replace(/\\/g, ' ')
            return sendFailedResponse(res, mymsg, 'invalid input', 403)
        }
        const findUser = await User.findOne({ email: req.body.email })
        if (!findUser) {
            return sendFailedResponse(res, 'invalid credentials', 'wrong email or password',403)
        }
        const validPass = await bcrypt.compare(req.body.password, findUser?.password)
        if(!validPass){
            return sendFailedResponse(res, 'invalid credentials', 'wrong email or password', 403)
        }
        const accessToken = jwt.sign(
            {email: req.body.email},
            process.env.SECRET as Secret
        )

        const {password, ...otherUser} = findUser._doc 
        return sendSuccessResponse(res, {user:otherUser, accessToken}, 'logged in successfully', 200)

    } catch (error) {
        return sendFailedResponse(res,'user can\'t be found', 'user does not exist',500 )
    }
}

export const verifyToken = async (req: CustomRequest, res: Response, next:NextFunction) =>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token){
        return sendFailedResponse(res,'Unauthorized','kindly login to access', 401)
    }
    const decodedjwt:any = jwt.verify(token, process.env.SECRET as Secret)
    const findUser = await User.findOne({email: decodedjwt.email})
    if(!findUser){
        return sendFailedResponse(res, 'revoked access', 'sign up to continue', 401)
    }
    req.user = findUser;
    next()
};
