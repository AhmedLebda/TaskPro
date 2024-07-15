import express from "express";
import corsOptions from "./config/corsOptions.js";
// routes
import note_Routes from "./routes/note.js";
import user_Routes from "./routes/user.js";
// middlewares
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import errorHandler from "./middlewares/error_handler/errorHandler.js";
import requestLogger from "./middlewares/logger/successLogger.js";
import errorLogger from "./middlewares/logger/errorLogger.js";
import logCorsError from "./middlewares/logger/corsLogger.js";
// db
import dbConnection from "./config/dbConnection.js";

// Init express app
const app = express();

// db connection
dbConnection();

// middlewares
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
// Logger setup
app.use(requestLogger);
app.use(errorLogger);
app.use(morgan("tiny"));
app.use(logCorsError);

// Routes
app.use("/api/notes", note_Routes);
app.use("/api/users", user_Routes);

// Unknown endpoint
app.use((req, res) => {
    res.status(404).json({ error: "unknown endpoint" });
});

// Error handler middleware
app.use(errorHandler);

export default app;
