const bcrypt = require("bcrypt");
const { controllerWrapper, HttpError, sendEmail } = require("../helpers");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { v4: uuidv4 } = require("uuid");

const { SECRET_KEY, BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw HttpError(409, "Email in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const avatar = gravatar.url(email);
  const verificationToken = uuidv4();
  const newUser = await User.create({
    ...req.body,
    password: hashedPassword,
    avatar,
    verificationToken,
  });
  if (!newUser) {
    throw HttpError(409, "error");
  }

  const verifyEmail = {
    to: email,
    subject: "Verification email",
    html: `<a href="${BASE_URL}/api/users/verify/${verificationToken}" target="_blank">Click to verify your email</a>`,
  };
  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      name: newUser.name,
      email: newUser.email,
    },
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(403, "User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.status(200).json({
    message: "Verification successful",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Registration succesfull. Please, verify your email",
    html: `<a href="${BASE_URL}/api/users/verify/${user.verificationToken}" target="_blank">Click to verify your email</a>`,
  };
  await sendEmail(verifyEmail);

  res.status(200).json({
    message: "Verification email sent",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verified");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  console.log("passwordCompare", passwordCompare);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };
  console.log("SECRET_KEY", SECRET_KEY);
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    email: user.email,
    subscription: user.subscription,
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

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUploud, originalname } = req.file;
  const image = await Jimp.read(tempUploud);
  image.resize(250, 250);
  const fileName = `${_id}_${originalname}`;
  const resultUploud = path.join(avatarsDir, fileName);
  await fs.rename(tempUploud, resultUploud);
  const avatarURL = path.join("avatars", fileName);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
};

module.exports = {
  register: controllerWrapper(register),
  verifyEmail: controllerWrapper(verifyEmail),
  login: controllerWrapper(login),
  getCurrentUser: controllerWrapper(getCurrentUser),
  logout: controllerWrapper(logout),
  updateAvatar: controllerWrapper(updateAvatar),
  resendVerifyEmail: controllerWrapper(resendVerifyEmail),
};
