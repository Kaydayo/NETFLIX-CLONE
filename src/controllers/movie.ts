import express, { Request, Response, NextFunction } from 'express';
import Movie from '../models/modelMovie'
import dotenv from 'dotenv';
import { validateRegister, validateLogin } from '../utils/validator';
import { sendFailedResponse, sendSuccessResponse } from '../utils/response';
import jwt, { Secret } from 'jsonwebtoken';
import { CustomRequest } from '../../@types';

dotenv.config()

export const createMovie = async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.user.isAdmin) {
        const newMovie = new Movie(req.body)
        try {
            const savedMovie = await newMovie.save()
            return sendSuccessResponse(res, { data: savedMovie }, 'saved successfully', 201)
        } catch (error) {
            return sendFailedResponse(res, error, 'an error occurred', 500)
        }
    } else {
        return sendFailedResponse(res, 'no priviledge', 'you are not allowed to create', 403)
    }
}

export const updateMovie = async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.user.isAdmin) {
        try {
            const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, { new: true })
            return sendSuccessResponse(res, { data: updatedMovie }, 'updated successfully', 200)
        } catch (error) {
            return sendFailedResponse(res, error, 'an error occurred', 500)
        }
    } else {
        return sendFailedResponse(res, 'no priviledge', 'you are not allowed to create', 403)
    }
}

export const deleteMovie = async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.user.isAdmin) {
        try {
            await Movie.findByIdAndDelete(req.params.id)
            return sendSuccessResponse(res, 'deletion was successful', 'The movie has been deleted', 200)
        } catch (error) {
            return sendFailedResponse(res, error, 'an error occurred', 500)
        }
    } else {
        return sendFailedResponse(res, 'no priviledge', 'you are not allowed to create', 403)
    }
}

export const getAMovie = async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.user.isAdmin) {
        try {
            const getMovie = await Movie.findById(req.params.id)
            return sendSuccessResponse(res, {data: getMovie}, 'successfully retrieved', 200)
        } catch (error) {
            return sendFailedResponse(res, error, 'an error occurred', 500)
        }
    } else {
        return sendFailedResponse(res, 'no priviledge', 'you are not allowed to create', 403)
    }
}

export const randomMovie = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const movieType = req.query.type
    let movie;
    try {
        if(movieType == "series"){
            movie = await Movie.aggregate([
                {$match:{isSeries: true}},
                {$sample: {size: 1}},
            ])
        } else {
            movie = await Movie.aggregate([
                {$match:{isSeries: false}},
                {$sample: {size: 1}},
            ])
        }
        return sendSuccessResponse(res, movie, 'movie type retrieved successfully', 200)
    } catch (error) {
        return sendFailedResponse(res, error, 'an error occurred', 500)
    }

}


