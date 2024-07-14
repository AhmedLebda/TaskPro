const errorhandler = (error, req, res, next) => {
    // console.log("Error Name", error.name);
    // console.log("Error Msg", error.message);
    console.log(`${error.name} | ${error.message}`);

    // Wrong mongo id
    if (error.name === "CastError") {
        return res.status(400).json({ error: "invalid id" });
    }

    if (error.name === "Error") {
        return res.status(400).json({ error: error.message });
    }

    if (error.name === "ValidationError") {
        return res
            .status(400)
            .json({ error: error.errors[Object.keys(error.errors)].message });
    }

    if (error.name === "MongoServerError" && error.code === 11000) {
        return res.status(400).json({ error: "Username already exists" });
    }
    if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ error: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expired" });
    }

    next(error);
};

export default errorhandler;
