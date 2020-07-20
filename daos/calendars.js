const Calendars = require('../models/calendars');

module.exports = {};

module.exports.create = async (name, events) => {
  return await Calendars.create({ name });
};

module.exports.getById = async (id) => {
  try {
    const calendar = await Calendars.findOne({ _id: id }).lean();
    return calendar;
  } catch (e) {
    return null;
  }
};

module.exports.getAll = async () => {
  try {
    const calendars = await Calendars.find({}).lean();
    return calendars;
  } catch (e) {
    return null;
  }
};

module.exports.update = async (id, obj) => {
  try {
    const calendar = await Calendars.updateOne({ _id: id }, { $set: obj });
    return calendar;
  } catch (e) {
    return null;
  }
}

module.exports.delete = async (id) => {
  try {
    const calendar = await Calendars.deleteOne({ _id: id });
    return calendar;
  } catch (e) {
    return null;
  }
};
