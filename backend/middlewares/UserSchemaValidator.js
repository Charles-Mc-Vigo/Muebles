const joi = require("joi");

const UserSchemaValidator = joi.object({
  firstname: joi.string().required().min(3).max(30),
  lastname: joi.string().required().min(3).max(30),
  gender:joi.string().required().valid("Male","Female"),
  streetAddress: joi.string().required(),
  municipality: joi.string().required().valid("Boac", "Gasan", "Torrijos", "Buenavista", "Mogpog", "Santa Cruz"),
  password: joi.string().required(),
});


module.exports = {UserSchemaValidator};