import express, { Request, Response, NextFunction } from 'express';
import List from '../models/modelList'
import dotenv from 'dotenv';
import { validateRegister, validateLogin } from '../utils/validator';
import { sendFailedResponse, sendSuccessResponse } from '../utils/response';
import jwt, { Secret } from 'jsonwebtoken';
import { CustomRequest } from '../../@types';

dotenv.config()

export const createList = async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.user.isAdmin) {
        const newList = new List(req.body)
        try {
            const savedList = await newList.save()
            return sendSuccessResponse(res, { data: savedList }, 'saved successfully', 201)
        } catch (error) {
            return sendFailedResponse(res, error, 'an error occurred', 500)
        }
    } else {
        return sendFailedResponse(res, 'no priviledge', 'you are not allowed to create', 403)
    }
}


export const deleteList = async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.user.isAdmin) {
        try {
            await List.findByIdAndDelete(req.params.id)
            return sendSuccessResponse(res, 'list has been deleted', 'list deleted successfully', 201)
        } catch (error) {
            return sendFailedResponse(res, error, 'an error occurred', 500)
        }
    } else {
        return sendFailedResponse(res, 'no priviledge', 'you are not allowed to create', 403)
    }
}

export const getAList = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const typeQuery = req.query.type;
    const genreQuery = req.query.genre;
    let list = [];

    try {
        if (typeQuery) {
            if (genreQuery) {
                list = await List.aggregate([
                    { $sample: { size: 10 } },
                    { $match: { type: typeQuery, genre: genreQuery } }
                ])
            } else {
                list = await List.aggregate([
                    { $sample: { size: 10 } },
                    { $match: { type: typeQuery } }
                ])
            }
        } else {
            list = await List.aggregate([
                {
                    $sample: {
                        size: 10
                    }
                }
            ])
        }
        return sendSuccessResponse(res, { data: list }, 'list retrieved successfully', 200)
    } catch (error) {
        return sendFailedResponse(res, error, 'an error occurred', 500)
    }
}