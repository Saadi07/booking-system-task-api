require("../init")();
require("../database");
const log = require("../logger");
const cron = require("node-cron");

const expirePendingBookings = require("./expirePendingBookings.cron");

cron.schedule("*/5 * * * *", () => {
    log.info("Running booking expiration job...");
    expirePendingBookings();
});
