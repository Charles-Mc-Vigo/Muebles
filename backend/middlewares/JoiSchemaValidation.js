const Joi = require("joi");

//user schema validation using Joi
const UserSchemaValidator = Joi.object({
  firstname: Joi.string().required().min(3).max(30),
  lastname: Joi.string().required().min(3).max(30),
  gender:Joi.string().required().valid("Male","Female"),
  streetAddress: Joi.string().required(),
  municipality: Joi.string().required().valid("Boac", "Gasan", "Torrijos", "Buenavista", "Mogpog", "Santa_Cruz"),
  password: Joi.string().required(),
});

const AdminSchemaValidator = Joi.object({
  firstname: Joi.string().required().min(3).max(30),
  lastname: Joi.string().required().min(3).max(30),
  gender:Joi.string().required().valid("Male","Female"),
  password: Joi.string().required(),
});


module.exports = {UserSchemaValidator, AdminSchemaValidator};