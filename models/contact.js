const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");

const favoriteOption = [true, false];

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

const joiSchema = Joi.object({
  name: Joi.string().alphanum().min(1).max(30).required(),
  phone: Joi.string().min(7).max(14).required(),
  email: Joi.string().email().required(),
});

const joiUpdatedSchema = Joi.object({
  name: Joi.string().alphanum().min(1).max(30).required(),
  phone: Joi.string().min(7).max(14),
  email: Joi.string().email(),
});

const joiUpdateFavoriteSchema = Joi.object({
  favorite: Joi.boolean()
    .valid(...favoriteOption)
    .required(),
});

contactSchema.post("save", handleMongooseError);

const Contact = model("contact", contactSchema);

module.exports = {
  contactSchema,
  joiSchema,
  joiUpdatedSchema,
  joiUpdateFavoriteSchema,
  Contact,
};
