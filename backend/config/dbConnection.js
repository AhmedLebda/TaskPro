import mongoose from "mongoose";
import config from "./config.js";

// Just a different color to make my console logs more clear ini the terminal
const LOG_COLOR = "\x1b[35m";

async function dbConnection() {
    const dbName = config.MONGO_URI.split("=").slice(-1);
    console.log(LOG_COLOR, `connecting to db: ${dbName}`);
    await mongoose.connect(config.MONGO_URI);
    console.log(LOG_COLOR, `Successfully connected to db: ${dbName}`);
}

export default dbConnection;
