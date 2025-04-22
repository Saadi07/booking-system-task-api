const { Model } = require("objection");

class Booking extends Model {
    static get tableName() {
        return "bookings";
    }

    static get idColumn() {
        return "id";
    }

    static get relationMappings() {
        const Product = require("./products.model");

        return {
            product: {
                relation: Model.BelongsToOneRelation,
                modelClass: Product,
                join: {
                    from: "bookings.productId",
                    to: "products.id"
                }
            }
        };
    }
}

module.exports = Booking;
