require("./init")();
require("./database");
const http = require("http");
const log = require("./logger");
const swaggerAutogen = require("swagger-autogen")({ openapi: process.env.SWAGGER_VERSION });

const {
    SWAGGER_OUTPUT_FILE,
    SWAGGER_ENDPOINT_DIR,
    PORT,
    API_VERSION = "v1"
} = process.env;

log.info({
    SWAGGER_OUTPUT_FILE,
    SWAGGER_ENDPOINT_DIR,
    PORT
}, "swagger options");

async function main() {
    await swaggerAutogen(SWAGGER_OUTPUT_FILE, [SWAGGER_ENDPOINT_DIR], require("./swagger/index"));
    const app = require("./app");
    app.set("port", PORT);
    http.createServer(app).listen(PORT, () => log.info(`server is listening on : http://localhost:${PORT}/api/${API_VERSION}/api-docs`));
}

main();
