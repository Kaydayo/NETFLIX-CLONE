import {Response} from 'express';
import {SuccessResponse, FailedResponse} from './interfaces'



type Payload = string|object|[]|unknown


export const sendSuccessResponse = (res: Response,  payload:Payload, message:string, statusCode:number):Response<SuccessResponse> => {
    return res.status(statusCode).json({success:true, payload, message})
} 

export const sendFailedResponse = (res: Response, error: Payload, message:string, statusCode:number):Response<FailedResponse> => {
    return res.status(statusCode).json({success:false, error, message})
}