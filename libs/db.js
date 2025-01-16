import mongoose from "mongoose";

const DBCon = async () => {
    try {
        // Ensure the environment variable name is correct
        const dbURI = process.env.MONGODB_ULR; 
        if (!dbURI) {
            throw new Error("MONGODB_URL environment variable is not defined");
        }

        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MONGODB IS CONNECTED');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
    }
};

export default DBCon;
