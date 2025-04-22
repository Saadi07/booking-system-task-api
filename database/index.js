const { Model, knexSnakeCaseMappers } = require("objection");
const log = require("../logger");
const {
    DB_CLIENT,
    DB_NAME,
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASS,
    DB_CON_MIN,
    DB_CON_MAX
} = process.env;

log.info({
    DB_CLIENT,
    DB_NAME,
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASS,
    DB_CON_MIN,
    DB_CON_MAX
});

const db = require("knex")({
    client: DB_CLIENT,
    connection: {
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASS,
        database: DB_NAME
    },
    pool: {
        min: parseInt(DB_CON_MIN || "5"),
        max: parseInt(DB_CON_MAX || "50")
    },
    ...knexSnakeCaseMappers()
});

Model.knex(db);

async function testConnection() {
    try {
        await db.raw("SELECT 1");
        return true;
    } catch (err) {
        throw new Error("Database connection failed: " + err.message);
    }
}

module.exports = { db, testConnection };
