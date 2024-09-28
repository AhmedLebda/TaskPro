import { CorsOptions } from "cors";
import allowedOrigins from "./allowedOrigins";

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if ((origin && allowedOrigins.includes(origin)) || !origin) {
            callback(null, true);
        } else {
            callback(new Error("CORS error"));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
};

export default corsOptions;
