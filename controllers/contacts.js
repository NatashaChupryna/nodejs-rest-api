const { controllerWrapper, checkId, HttpError } = require("../helpers");

const { Contact } = require("../models/contact");

const getAllContacts = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Contact.find(owner, { skip, limit });
  res.json(result);
};

const getById = async (req, res, next) => {
  const { _id: owner } = req.user;
  const result = await Contact.findOne({ _id: req.params.contactId, owner });
  checkId(result);
  res.json(result);
};

const addContact = async (req, res, next) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const removeContact = async (req, res, next) => {
  const { id } = req.params.contactId;
  const result = await Contact.findByIdAndDelete(id);
  checkId(result);
  res.json({ message: "Contact deleted" });
};

const updateContact = async (req, res, next) => {
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndUpdate(
    { _id: req.params.contactId, owner },
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
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndUpdate(
    { _id: req.params.contactId, owner },
    req.body,
    { new: true }
  );

  if (!result) {
    throw HttpError(404, "Not found");
  }
  checkId(result);
  res.status(200).json(result);
};

module.exports = {
  getAllContacts: controllerWrapper(getAllContacts),
  getById: controllerWrapper(getById),
  addContact: controllerWrapper(addContact),
  removeContact: controllerWrapper(removeContact),
  updateContact: controllerWrapper(updateContact),
  updateStatusContact: controllerWrapper(updateStatusContact),
};
