require("../init")();
require("../database");
const log = require("../logger");
const cron = require("node-cron");

const expirePendingBookings = require("./expirePendingBookings.cron");

const CRON_EXPRESSION = process.env.BOOKING_EXPIRY_CRON || "*/2 * * * *";

cron.schedule(CRON_EXPRESSION, () => {
    const currentTime = new Date().toISOString();
    log.info(`Running booking expiration job at ${currentTime}...`);
    expirePendingBookings();
});

log.info(`Cron job scheduled to run every 5 minutes: ${CRON_EXPRESSION}`);
