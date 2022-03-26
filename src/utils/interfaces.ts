import mongoose from 'mongoose';

export interface IUser extends mongoose.Document{
    username: string;
    email: string;
    password: string;
    profilePic: string;
    isAdmin: boolean
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