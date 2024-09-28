import mongoose from "mongoose";
import dbConnection from "../../config/dbConnection";
beforeAll(async () => {
    await dbConnection();
});

afterAll(async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
});
