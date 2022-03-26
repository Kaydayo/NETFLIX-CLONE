import mongoose from 'mongoose';
import { IList } from '../utils/interfaces';
const ListSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
    },
    genre: {
        type: String,
    },
    content: {
        type: Array
    }

}, {
    timestamps: true
})

export default mongoose.model<IList>("List", ListSchema);
