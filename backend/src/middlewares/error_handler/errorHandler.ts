import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
    code?: number;
    statusCode: number;
}

const errorhandler = (
    error: CustomError,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    console.log(`${error.name} | ${error.message}`);

    // Wrong mongo id
    if (error.name === "CastError") {
        res.status(400).json({ error: "invalid id" });
        return;
    }

    if (error.name === "Error") {
        res.status(400).json({ error: error.message });
        return;
    }

    if (error.name === "MongoServerError" && error.code === 11000) {
        res.status(400).json({ error: "Username already exists" });
        return;
    }
    if (error.name === "JsonWebTokenError") {
        res.status(401).json({ error: "Invalid token" });
        return;
    }
    if (error.name === "TokenExpiredError") {
        res.status(401).json({ error: "Token expired" });
        return;
    }

    if (error.name === "PermissionError") {
        res.status(error.statusCode).json({ error: error.message });
        return;
    }
    if (error.name === "AssociatedDataError") {
        res.status(error.statusCode).json({ error: error.message });
        return;
    } else {
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }
};

export default errorhandler;
