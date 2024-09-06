const Joi = require("joi");

//order schema validation using Joi
const OrderSchemaValidator = Joi.object({
  orderStatus: Joi.string().valid("Pending", "Shipped", "Delivered", "Cancelled")
});


//user schema validation using Joi
const UserSchemaValidator = Joi.object({
  firstname: Joi.string().required().min(3).max(30),
  lastname: Joi.string().required().min(3).max(30),
  gender:Joi.string().required().valid("Male","Female"),
  streetAddress: Joi.string().required(),
  municipality: Joi.string().required().valid("Boac", "Gasan", "Torrijos", "Buenavista", "Mogpog", "Santa_Cruz"),
  password: Joi.string().required(),
});


module.exports = {UserSchemaValidator, OrderSchemaValidator};