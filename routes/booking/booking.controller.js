const Joi = require("joi");
const bookingService = require("./booking.service");
const log = require("../../logger");

class BookingController {
    async reserve(payload, user) {
        try {
            const schema = Joi.object({
                productId: Joi.string().required().trim()
            });

            const { error } = schema.validate(payload);

            if (error) {
                log.error({
                    error: error.details[0].message,
                    method: "POST /booking/reserve"
                });

                return {
                    success: false,
                    statusCode: 400,
                    message: error.details[0].message
                };
            }

            const result = await bookingService.reserveProduct(payload.productId, user);

            log.info({
                message: "Product reserved successfully",
                payload,
                user,
                response: result
            });

            return {
                success: true,
                statusCode: 200,
                message: "Product reserved successfully",
                data: result
            };
        } catch (error) {
            log.error({
                errorMessage: error.message,
                errorStack: error.stack,
                payload,
                method: "POST /booking/reserve"
            });

            return {
                statusCode: error.data?.statusCode || 500,
                success: false,
                message: error.message || "Failed to reserve product"
            };
        }
    }

    async pay(payload, user) {
        try {
            const schema = Joi.object({
                bookingId: Joi.string().required().trim(),
                sessionId: Joi.string().required().trim()
            });

            const { error } = schema.validate(payload);

            if (error) {
                log.error({
                    error: error.details[0].message,
                    method: "POST /booking/pay"
                });

                return {
                    success: false,
                    statusCode: 400,
                    message: error.details[0].message
                };
            }

            const result = await bookingService.confirmPayment(payload.bookingId, payload.sessionId, user);

            log.info({
                message: "Mock payment confirmed & booking finalized",
                payload,
                user,
                result
            });

            return {
                success: true,
                statusCode: 200,
                message: "Booking confirmed successfully",
                data: result
            };
        } catch (error) {
            log.error({
                errorMessage: error.message,
                errorStack: error.stack,
                payload,
                method: "POST /booking/pay"
            });

            return {
                statusCode: error.data?.statusCode || 500,
                success: false,
                message: error.message || "Failed to confirm booking"
            };
        }
    }
}

module.exports = new BookingController();
