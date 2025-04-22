const { Bookings, Products } = require("../models");
const log = require("../logger");

const expirePendingBookings = async () => {
    const cutoffTime = new Date(Date.now() - 5 * 60 * 1000);

    const expiredBookings = await Bookings.query()
        .where("status", "PENDING")
        .where("created_at", "<", cutoffTime);

    for (const booking of expiredBookings) {
        await Bookings.transaction(async trx => {
            await Bookings.query(trx)
                .findById(booking.id)
                .patch({ status: "EXPIRED", updated_at: new Date() });

            await Products.query(trx)
                .findById(booking.productId)
                .patch({ available: true, updated_at: new Date() });

            log.info(`Booking ${booking.id} expired and product unlocked.`);
        });
    }

    log.info(`Expired ${expiredBookings.length} bookings.`);
};

module.exports = expirePendingBookings;
