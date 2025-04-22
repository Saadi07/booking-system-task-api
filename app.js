"use strict";

const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const { engine: expressHandlebars } = require("express-handlebars");
const responseTime = require("response-time");
const routes = require("./routes");
const swaggerFile = require("./swagger-output.json");
const expressErrorMiddleware = require("./middlewares/expressError.middleware");
const errorMiddleware = require("./middlewares/error.middleware");

const { REQUEST_BODY_SIZE_LIMIT, API_NAME = "wati-chatbot-api", API_VERSION = "v1" } = process.env;

const app = express();

app.engine("handlebars", expressHandlebars());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");
app.set("trust proxy", 1);

app.disable("x-powered-by");
app.use(helmet({
    frameguard: true,
    hidePoweredBy: true,
    noSniff: true,
    referrerPolicy: true,
    xssFilter: true,
    dnsPrefetchControl: true
}));
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: REQUEST_BODY_SIZE_LIMIT }));
app.use(express.urlencoded({ limit: REQUEST_BODY_SIZE_LIMIT, extended: false }));
app.use(cookieParser());

app.use(responseTime());
app.use((req, res, next) => {
    req.currentTime = Date.now();
    next();
});
app.use(morgan("[:date] :remote-addr :method :url :response-time ms - :status"));

app.use(express.static(path.join(__dirname, "public")));

app.use(`/api/${API_VERSION}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(`/api/${API_VERSION}`, routes);
app.use(`/api/${API_NAME}/${API_VERSION}`, routes);

app.use(errorMiddleware());
app.use(expressErrorMiddleware());

module.exports = app;
