const joi = require("joi");

const FurnitureSchemaValidator = joi.object({
  category: joi.string().required().valid("Door","Bed frame","Cabinet","Chair", "Table","Sala set"),
  furnitureType: joi.string().required().min(3).max(20),
  description: joi.string().required().min(0).max(30),
  price: joi.number().required().default(0),
  currency: joi.string().valid("PHP")
})

module.exports = {FurnitureSchemaValidator};