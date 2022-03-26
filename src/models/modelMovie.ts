import mongoose from 'mongoose';
import { IMovie } from '../utils/interfaces';

const MovieSchema =  new mongoose.Schema({
    title:{
        type: String,
        required: true,
        unique: true
    },
    desc: {
        type: String,
    },
    img:{
        type: String
    },
    imgTitle :{
        type: String
    },
    imgSm:{
        type: String
    },
    trailer:{
        type: String
    },
    video:{
        type: String
    },
    year:{
        type: String
    },
    limit:{
        type: Number
    },
    genre:{
        type: String
    },
    isSeries:{
         type: Boolean,
         default: false
    }
},{
    timestamps: true
}) 

export default mongoose.model<IMovie>("Movie", MovieSchema);
