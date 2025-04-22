const jwt = require("jsonwebtoken");
const logger = require("../logger");
const { JWT_SECRET, BASIC_AUTH_USERNAME, BASIC_AUTH_PASSWORD } = process.env;
class service {
    async checkAuthentication({ authorization }, res) {
        if (!authorization) {
            const responseMessage = "authorization header is required.";
            throw new Error(responseMessage);
        }

        const [tokenType, tokenHash] = authorization.split(" ");
        if (!["Basic", "Bearer"].includes(tokenType)) {
            const responseMessage = "Invalid token type.";
            throw new Error(responseMessage);
        }
        if (tokenType == "Bearer") {
            try {
                const decoded = jwt.verify(tokenHash, JWT_SECRET);
                return decoded;
            } catch (error) {
                logger.error(error, `${__file}:${__line} ` + "Got error in authentication middleware");
                const responseMessage = "Invalid bearer token.";
                throw new Error(responseMessage);
            }
        } else {
            try {
                const [username, password] = Buffer.from(tokenHash, "base64").toString("utf8").split(":");
                if (username === BASIC_AUTH_USERNAME && password === BASIC_AUTH_PASSWORD) {
                    return { username };
                } else {
                    const responseMessage = "Invalid basic token.";
                    throw new Error(responseMessage);
                }
            } catch (error) {
                logger.error(error, `${__file}:${__line} ` + "Got error in authentication middleware");
                const responseMessage = "Invalid basic token.";
                throw new Error(responseMessage);
            }
        }
    }
}

module.exports = new service();
