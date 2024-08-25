import mongoose from "mongoose";
import config from "./config";

async function dbConnection() {
    if (!config.MONGO_URI) throw new Error("No db uri provided");

    try {
        const dbName = config.MONGO_URI.split("=").slice(-1);
        console.log(`connecting to db: ${dbName}`);
        await mongoose.connect(config.MONGO_URI);
        console.log(`Successfully connected to db: ${dbName}`);
    } catch (error) {
        if (error instanceof Error) {
            console.log(`Error connecting to db: ${error.message}`);
        }
        process.exit(1);
    }
}

export default dbConnection;
