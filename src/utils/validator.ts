import Joi, { string } from 'joi'


export interface Register {
    username: string,
    email:string,
    password: string
}

export interface Login {
    email: string,
    password: string
}

export const validateRegister = (data: Register) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    })
    return schema.validate(data);
}

export const validateLogin = (data: Login) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    })
    return schema.validate(data)
}
