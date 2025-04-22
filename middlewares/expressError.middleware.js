const log = require("../logger");

function middleware() {
    return (error, req, res, next) => {
        log.error(error, "error handling middleware");
        const message = error.nativeError ? error.nativeError.sqlMessage : error.message;
        res.status(200).json({
            success: false,
            message,
            data: null
        });
    };
}

module.exports = middleware;
