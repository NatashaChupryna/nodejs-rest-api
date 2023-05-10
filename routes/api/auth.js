const express = require("express");
const controller = require("../../controllers/auth");
const { validateBody, authenticate, upload } = require("../../middlewares");
const {
  registerSchema,
  loginSchema,
  verifySchema,
} = require("../../models/user");

const router = express.Router();

router.post("/register", validateBody(registerSchema), controller.register);

router.get("/verify/:verificationToken", controller.verifyEmail);

router.post(
  "/verify",
  validateBody(verifySchema),
  controller.resendVerifyEmail
);

router.post("/login", validateBody(loginSchema), controller.login);

router.get("/current", authenticate, controller.getCurrentUser);

router.post("/logout", controller.logout);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  controller.updateAvatar
);

module.exports = router;
