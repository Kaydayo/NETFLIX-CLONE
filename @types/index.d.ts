import {User} from '../src/models/modelUser'

import { Request } from 'express';


export interface CustomRequest extends Request {
  user?: User;
}
