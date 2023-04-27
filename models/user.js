const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.post("save", handleMongooseError);

const User = model("user", userSchema);

const registerSchema = Joi.object({
  name: Joi.string().min(1).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { User, registerSchema, loginSchema };
