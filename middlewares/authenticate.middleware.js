const authService = require("../services/auth.service");
const logger = require("../logger");

function middleware() {
    return async (req, res, next) => {
        try {
            const authUser = await authService.checkAuthentication(req.headers, res);
            req.user = authUser;
            logger.info({ authUser }, `${__file}:${__line} ` + "Authentication successful");
        } catch (error) {
            logger.error(error, `${__file}:${__line} ` + "Got error in authentication middleware");
            return res.status(401).send({
                success: false,
                message: error.message,
                data: null
            });
        }

        next();
    };
}

module.exports = middleware;
