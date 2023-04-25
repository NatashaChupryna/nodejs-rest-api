const express = require("express");
const controller = require("../../controllers/contacts");
const {
  joiSchema,
  joiUpdatedSchema,
  joiUpdateFavoriteSchema,
} = require("../../models/contact");
const { validateBody, isValidId, authenticate } = require("../../middlewares");

const router = express.Router();

router.get("/", authenticate, controller.getAllContacts);

router.get("/:contactId", authenticate, isValidId, controller.getById);

router.post("/", authenticate, validateBody(joiSchema), controller.addContact);

router.delete("/:contactId", authenticate, isValidId, controller.removeContact);

router.put(
  "/:contactId",
  isValidId,
  validateBody(joiUpdatedSchema),
  controller.updateContact
);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(joiUpdateFavoriteSchema),
  controller.updateStatusContact
);

module.exports = router;
