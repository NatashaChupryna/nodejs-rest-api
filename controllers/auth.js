const bcrypt = require("bcrypt");
const { controllerWrapper, HttpError } = require("../helpers");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = async (req, res) => {
  const { email, password } = req.body;
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw HttpError(409, "Email in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashedPassword });
  if (!newUser) {
    throw HttpError(409, "error");
  }

  res.status(201).json({
    user: {
      name: newUser.name,
      email: newUser.email,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password); // повернення хешованого паролю
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const { SECRET_KEY } = process.env;
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.status(200).json({
    token,
    user: {
      email: user.email,
    },
  });
};

const getCurrentUser = async (req, res) => {
  const { email, subscription } = req.user;

  return res.status(200).json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).end();
};

module.exports = {
  register: controllerWrapper(register),
  login: controllerWrapper(login),
  getCurrentUser: controllerWrapper(getCurrentUser),
  logout: controllerWrapper(logout),
};
