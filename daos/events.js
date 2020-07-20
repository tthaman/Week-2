const Events = require('../models/events');

module.exports = {};

module.exports.create = async (name, date, calendarId) => {
  const event =  await Events.create( {name, date, calendarId});
  return event;
};

module.exports.getById = async (id) => {
  try {
    const event = await Events.findOne({ _id: id }).lean();
    return event;
  } catch (e) {
    return null;
  }
};

module.exports.getAll = async (calId) => {
  try {
    const events = await Events.find({calendarId: calId}).lean();
    return events;
  } catch (e) {
    return null;
  }
};

module.exports.update = async ( id, obj) => {
  try {
    const event = await Events.updateOne({ _id: id }, { $set: obj });
    return event;
  } catch (e) {
    return null;
  }
}

module.exports.delete = async (id) => {
  try {
    const event = await Events.deleteOne({ _id: id });
    return event;
  } catch (e) {
    return null;
  }
};
