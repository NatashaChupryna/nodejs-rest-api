const express = require("express");
const controller = require("../../controllers/auth");
const { validateBody, authenticate } = require("../../middlewares");
const { registerSchema, loginSchema } = require("../../models/user");

const router = express.Router();

router.post("/register", validateBody(registerSchema), controller.register);

router.post("/login", validateBody(loginSchema), controller.login);

router.get("/current", authenticate, controller.getCurrentUser);

router.post("/logout", controller.logout);

module.exports = router;
