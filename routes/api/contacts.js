const express = require("express");
const router = express.Router();
const Joi = require("joi");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");

const contactSchema = Joi.object({
  name: Joi.string().alphanum().min(1).max(30).required(),
  phone: Joi.string().min(7).max(14).required(),
  email: Joi.string().email().required(),
});

const updatedContactSchema = Joi.object({
  name: Joi.string().alphanum().min(1).max(30).required(),
  phone: Joi.string().min(7).max(14),
  email: Joi.string().email(),
});

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.json({
      status: "success",
      code: 200,
      contacts,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    if (!contact) {
      const error = new Error("Contact not found");
      error.status = 404;
      throw error;
    }
    res.json({
      status: "success",
      code: 200,
      contact,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      error.status = 400;
      throw error;
    }
    const newContact = await addContact(req.body);
    res.status(201).json({
      status: "success",
      code: 201,
      contact: newContact,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const removedContact = await removeContact(contactId);
    if (!removedContact) {
      return next();
    }
    res.json({
      status: "success",
      code: 200,
      contact: removedContact,
      message: "Contact deleted",
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { error, value } = updatedContactSchema.validate(req.body);
    if (error) {
      error.status = 400;
      throw error;
    }
    if (!Object.keys(value).length) {
      const error = new Error("missing fields");
      error.status = 400;
      throw error;
    }
    const { contactId } = req.params;
    const updatedContact = await updateContact(contactId, req.body);
    if (!updatedContact) {
      return next();
    }
    res.json({
      status: "success",
      code: 200,
      contact: updatedContact,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
