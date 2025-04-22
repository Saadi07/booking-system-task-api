const redis = require("../../redis");
const { ErrorData } = require("../../errors");
const { v4: uuidv4 } = require("uuid");
const { lockProduct, unlockProduct, getLockOwner } = require("../../services/productLock.service");
const log = require("../../logger");
const { Bookings, Products } = require("../../models");
const { transaction } = require('objection');
const { simulatePayment } = require("../../services/payment.service");
const { withTimeout } = require("../../utility/index");

class BookingService {
    async reserveProduct(productId, userId) {
        const sessionId = uuidv4();
        const lockKey = `lock:product:${productId}`;
        const lockTTL = 200;

        const locked = await lockProduct(lockKey, sessionId, lockTTL);
        if (!locked) {
            throw new ErrorData("Product is currently being reserved by another user", { statusCode: 400 });
        }

        const product = await Products.query()
            .findById(productId)
            .where("available", true);

        if (!product) {
            await unlockProduct(lockKey, sessionId);
            throw new ErrorData("Product not available", { statusCode: 404 });
        }

        const bookingId = uuidv4();

        await Bookings.query().insert({
            id: bookingId,
            productId,
            sessionId,
            userId: userId,
            status: "PENDING"
        });

        log.info({
            productId,
            sessionId,
            bookingId,
            userId
        }, "Reserved product with pending booking");

        return {
            sessionId,
            bookingId,
            productId,
            expiresIn: lockTTL
        };
    }

    async confirmPayment(bookingId, sessionId, userId) {
        const booking = await Bookings.query()
            .findById(bookingId)
            .where('userId', userId);
            
        if (!booking) throw new ErrorData("Booking not found", { statusCode: 404 });
        if (booking.status !== "PENDING") throw new ErrorData("Booking already processed", { statusCode: 400 });
        if (booking.sessionId !== sessionId) throw new ErrorData("Invalid session for this booking", { statusCode: 400 });

        const lockKey = `lock:product:${booking.productId}`;
        const lockOwner = await getLockOwner(lockKey);
        
        if (lockOwner !== sessionId) {
            throw new ErrorData("Lock expired or session mismatch", { statusCode: 400 });
        }

        const paymentSuccess = await withTimeout(
            simulatePayment(),
            5000,
            "Payment module did not respond in time"
          );

        if (paymentSuccess) {
            await transaction(Bookings.knex(), async trx => {
                await Bookings.query(trx)
                    .patch({
                        status: "CONFIRMED",
                        confirmedAt: new Date()
                    })
                    .findById(bookingId);

                await Products.query(trx)
                    .patch({
                        available: false
                    })
                    .findById(booking.productId);
            });

            await unlockProduct(lockKey, sessionId);

            return {
                bookingId,
                status: "CONFIRMED"
            };
        } else {
            await unlockProduct(lockKey, sessionId);
            throw new ErrorData("Mock payment failed", { statusCode: 500 });
        }
    }
}

module.exports = new BookingService();
