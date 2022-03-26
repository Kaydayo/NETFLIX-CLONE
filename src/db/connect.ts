import mongoose from 'mongoose'

export const connectDB = () => {
    try {
        mongoose.connect(process.env.MONGO_URI as string).then(() => {
            console.log("Connected to DB");
        });
    } catch (error) {
        console.log(error);
    }
};

