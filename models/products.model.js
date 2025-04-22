const { Model } = require("objection");

class Product extends Model {
    static get tableName() {
        return "products";
    }

    static get idColumn() {
        return "id";
    }

    static get relationMappings() {
        const Booking = require("./bookings.model");

        return {
            bookings: {
                relation: Model.HasManyRelation,
                modelClass: Booking,
                join: {
                    from: "products.id",
                    to: "bookings.productId"
                }
            }
        };
    }
}

module.exports = Product;
