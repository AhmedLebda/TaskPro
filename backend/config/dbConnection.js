import mongoose from "mongoose";
import config from "./config.js";

async function dbConnection() {
    try {
        const dbName = config.MONGO_URI.split("=").slice(-1);
        console.log(`connecting to db: ${dbName}`);
        await mongoose.connect(config.MONGO_URI);
        console.log(`Successfully connected to db: ${dbName}`);
    } catch (error) {
        console.log(`Error connecting to db: ${error.message}`);
        process.exit(1);
    }
}

export default dbConnection;
