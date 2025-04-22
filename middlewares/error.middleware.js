const log = require("../logger");

function middleware() {
    return async (req, res, next) => {
        try {
            next();
        } catch (error) {
            log.error(error, "error handling middleware");
            const message = error.nativeError ? error.nativeError.sqlMessage : error.message;
            res.json({
                success: false,
                message,
                data: null
            });
        }
    };
}

module.exports = middleware;
