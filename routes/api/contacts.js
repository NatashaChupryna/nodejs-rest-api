const express = require("express");
const controller = require("../../controllers/contacts");
const {
  joiSchema,
  joiUpdatedSchema,
  joiUpdateFavoriteSchema,
} = require("../../models");
const { validateBody, isValidId } = require("../../middlewares");

const router = express.Router();

router.get("/", controller.listContacts);

router.get("/:contactId", isValidId, controller.getById);

router.post("/", validateBody(joiSchema), controller.addContact);

router.delete("/:contactId", isValidId, controller.removeContact);

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
