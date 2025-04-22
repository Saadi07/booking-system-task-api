const express = require("express");
const router = express.Router();
const authenticate = require("../../middlewares/authenticate.middleware");
const logger = require("../../logger");
const bookingController = require("./booking.controller");

/**
 * @route POST /booking/reserve
 * @desc Reserve a product for booking
 * @access Private
 */
router.post("/reserve", authenticate(), async (req, res, next) => {
    /*
      #swagger.tags = ['Booking']
      #swagger.description = 'Reserve a product before payment.'
      #swagger.requestBody = {
          required: true,
          content: {
              "application/json": {
                  schema: {
                      type: 'object',
                      properties: {
                          productId: { type: 'string' },
                          userId: { type: 'string' }
                      },
                      required: ['productId', 'userId']
                  }
              }
          }
      }
      #swagger.responses[200] = {
          description: 'Product reserved successfully.',
          content: { "application/json": { schema: { $ref: '#/definitions/responseObject' } } }
      }
    */

    logger.info({
        body: req.body,
        method: "POST /booking/reserve"
    });

    const result = await bookingController.reserve(req.body);
    return res.status(result.statusCode).json(result);
});

/**
 * @route POST /booking/pay
 * @desc Confirm a booking via mock payment
 * @access Private
 */
router.post("/pay", authenticate(), async (req, res, next) => {
    /*
      #swagger.tags = ['Booking']
      #swagger.description = 'Confirm booking by processing a mock payment.'
      #swagger.requestBody = {
          required: true,
          content: {
              "application/json": {
                  schema: {
                      type: 'object',
                      properties: {
                          bookingId: { type: 'string' },
                          sessionId: { type: 'string' },
                          userId: { type: 'string' },
                      },
                      required: ['bookingId', 'sessionId', 'userId']
                  }
              }
          }
      }
      #swagger.responses[200] = {
          description: 'Booking confirmed after successful mock payment.',
          content: { "application/json": { schema: { $ref: '#/definitions/responseObject' } } }
      }
    */

    logger.info({
        user: req.user,
        body: req.body,
        method: "POST /booking/pay"
    });

    const result = await bookingController.pay(req.body);
    return res.status(result.statusCode).json(result);
});

module.exports = router;
