import mongoose from 'mongoose';

export interface IUser extends mongoose.Document{
    username: string;
    email: string;
    password: string;
    profilePic: string;
    isAdmin: boolean;
    _doc?: any;
}

export interface IList extends mongoose.Document{
    title: string;
    type: string;
    genre: string;
    content: [];
}

export interface IMovie extends mongoose.Document{
    title: string;
    desc: string;
    img: string;
    imgTitle: string;
    imgSm: string;
    trailer: string;
    video: string;
    year: string;
    limit: number;
    genre: string;
    isSeries: boolean
}

export interface SuccessResponse {
    success: boolean;
    payload: object|string|[];
    message: string
}

export interface FailedResponse{
    success: boolean;
    error: object|string|[]
    message: string
}