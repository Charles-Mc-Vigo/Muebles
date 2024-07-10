const joi = require("joi");

const OrderSchemaValidator = joi.object({
  orderStatus:joi.string().valid("Pending","Shipped","Delivered","Cancelled")
})


module.exports = {OrderSchemaValidator};