import {Response} from 'express';
import {SuccessResponse, FailedResponse} from './interfaces'



type Payload = string|object|[]|unknown


export const sendSuccessResponse = (res: Response,  payload:Payload, message:string):Response<SuccessResponse> => {
    return res.status(201).json({success:true, payload, message})
} 

export const sendFailedResponse = (res: Response, error: Payload, message:string):Response<FailedResponse> => {
    return res.status(403).json({success:false, error, message})
}