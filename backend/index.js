import config from "./config/config.js";
import app from "./app.js";
import mongoose from "mongoose";
// Just a different color to make my console logs more clear ini the terminal
const LOG_COLOR = "\x1b[35m";

// Starting Server
mongoose.connection.once("open", () => {
    app.listen(config.PORT, () =>
        console.log(LOG_COLOR, "your server is running on port:" + config.PORT)
    );
});
