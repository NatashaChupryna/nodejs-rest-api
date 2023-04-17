const { controllerWrapper, checkId, HttpError } = require("../helpers");

const { Contact } = require("../models");

const listContacts = async (req, res, next) => {
  const result = await Contact.find();
  res.json(result);
};

const getById = async (req, res, next) => {
  const { id } = req.params.contactId;
  const result = await Contact.findById(id);
  checkId(result);
  res.json(result);
};

const addContact = async (req, res, next) => {
  const result = await Contact.create(req.body);
  res.status(201).json(result);
};

const removeContact = async (req, res, next) => {
  const { id } = req.params.contactId;
  const result = await Contact.findByIdAndRemove(id);
  checkId(result);
  res.json({ message: "Contact deleted" });
};

const updateContact = async (req, res, next) => {
  const result = await Contact.findByIdAndUpdate(
    req.params.contactId,
    req.body,
    { new: true }
  );
  checkId(result);
  res.json({
    status: "success",
    code: 200,
    contact: result,
    message: "Contact deleted",
  });
};

const updateStatusContact = async (req, res, next) => {
  if (!req.body.favorite) {
    res.status(400).json({
      message: "missing field favorite",
    });
  }
  const result = await Contact.findByIdAndUpdate(
    req.params.contactId,
    req.body,
    {
      new: true,
    }
  );

  if (!result) {
    throw HttpError(404, "Not found");
  }
  checkId(result);
  res.status(200).json(result);
};

module.exports = {
  listContacts: controllerWrapper(listContacts),
  getById: controllerWrapper(getById),
  addContact: controllerWrapper(addContact),
  removeContact: controllerWrapper(removeContact),
  updateContact: controllerWrapper(updateContact),
  updateStatusContact: controllerWrapper(updateStatusContact),
};
