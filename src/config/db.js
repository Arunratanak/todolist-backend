import mongoose from "mongoose"

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Mongodb connected');

    }catch (err) {
        console.error("MongoDB connection failed: ", err.message);
        process.exit(1);
    }
};

export {connectDB};