const { ErrorData } = require("../errors");

function withTimeout(promise, ms, timeoutMessage = "Operation timed out") {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new ErrorData(timeoutMessage, { statusCode: 504 })), ms)
        )
    ]);
}

module.exports = {
    withTimeout
};
