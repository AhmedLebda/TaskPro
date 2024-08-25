import config from "./config/config.js";
import app from "./app.js";
import mongoose from "mongoose";
import createAdmin from "./config/initialAdmin.js";
import dbConnection from "./config/dbConnection.js";

// Connecting to db
dbConnection();

// Starting Server
mongoose.connection.once("open", async () => {
    // Creates an Admin when the server starts.
    await createAdmin();

    app.listen(config.PORT, () =>
        console.log("your server is running on port:" + config.PORT)
    );
});
