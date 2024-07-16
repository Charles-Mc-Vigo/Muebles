const Joi = require("joi");

//furniture schema validation using joi
const FurnitureSchemaValidator = Joi.object({
  category: Joi.string().required().valid("Door","Bed frame","Cabinet","Chair", "Table","Sala set"),
  furnitureType: Joi.string().required().min(3).max(20),
  description: Joi.string().required().min(0).max(30),
  price: Joi.number().required().default(0),
  currency: Joi.string().valid("PHP")
})


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
  municipality: Joi.string().required().valid("Boac", "Gasan", "Torrijos", "Buenavista", "Mogpog", "Santa Cruz"),
  password: Joi.string().required(),
});


module.exports = {UserSchemaValidator, OrderSchemaValidator, FurnitureSchemaValidator};