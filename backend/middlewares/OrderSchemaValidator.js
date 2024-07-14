const Joi = require("joi");

const OrderSchemaValidator = Joi.object({
  orderStatus: Joi.string().valid("Pending", "Shipped", "Delivered", "Cancelled")
});

module.exports = OrderSchemaValidator;
