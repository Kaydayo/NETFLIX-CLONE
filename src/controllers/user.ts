import express, { Request, Response, NextFunction } from 'express';
import User from '../models/modelUser';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { validateRegister, validateLogin } from '../utils/validator';
import { sendFailedResponse, sendSuccessResponse } from '../utils/response';
import jwt, { Secret } from 'jsonwebtoken';
import config from '../utils/configs';
import { CustomRequest } from '../../@types';

dotenv.config()

export const updateUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, config.myhashlengthjwttoken)
        }
        try {
            const updateUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body
                },
                {
                    new: true
                }
            )
            return sendSuccessResponse(res, updateUser, 'account update successful', 201)
        } catch (error) {
            return sendFailedResponse(res, error, 'an error occurred', 500)
        }
    } else {
        return sendFailedResponse(res, 'no priviledge', 'you can only update your account', 403)
    }
}

export const deleteAUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id)
            return sendSuccessResponse(res, 'user has been deleted', 'user delete successfull', 200)
        } catch (error) {
            return sendFailedResponse(res, error, 'an error occurred', 500)
        }
    } else {
        return sendFailedResponse(res, 'no priviledge', 'you can only delete your account', 403)
    }
}

export const getAUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const findUser = await User.findById(req.params.id)
        const { password, ...otherUser } = findUser?._doc
        return sendSuccessResponse(res, { user: otherUser }, 'user retrieved successfull', 200)
    } catch (error) {
        return sendFailedResponse(res, error, 'an error occurred', 500)
    }
}

export const getAllUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const query = req.query.new
    if (req.user.isAdmin) {
        try {
            const allUsers = query ? await User.find().sort({ _id: -1 }).limit(10) : await User.find()
            return sendSuccessResponse(res, allUsers, 'all users retrieved successfull', 200)
        } catch (error) {
            return sendFailedResponse(res, error, 'an error occurred', 500)
        }
    } else {
        return sendFailedResponse(res, 'no admin priviledge found!', 'you are not allowed to get all users', 403)
    }
}

export const getMonthlyStats = async (req: Request, res: Response, next: NextFunction) => {
    const today = new Date()
    const lastYear = today.setFullYear(today.getFullYear() - 1)
    const monthArray = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    try {
        const data = await User.aggregate([
            {
                $project: { $month: '$createdAt' }
            },
            {
                $group: {
                    _id: '$month',
                    total: { $sum: 1 }
                }
            }
        ]);
        let newData = data.map(datum => {
            const aMonth = monthArray[datum._id]
            return {...datum ,month: aMonth}
        })
        return sendSuccessResponse(res, {data: newData}, 'monthly statistics retrieved successfully', 200)
    } catch (error) {
        return sendFailedResponse(res, error, 'an error occurred', 500)
    }
}
