import allowedOrigins from "./allowedOrigins.js";

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error("CORS error"));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
};

export default corsOptions;
