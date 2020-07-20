const { Router } = require("express");
const router = Router();

const CalendarDAO = require('../daos/calendars');
const EventDAO = require('../daos/events');


router.post("/", async (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).send('body parameter "name" is required"');
  } else {
    const calendar = await CalendarDAO.create(name);
    res.json(calendar);
  }
});

router.get("/:id", async (req, res, next) => {
  const calendar = await CalendarDAO.getById(req.params.id);
  if (calendar) {
    res.json(calendar);
  } else {
    res.sendStatus(404);
  }
});

router.get("/", async (req, res, next) => {
  const calendars = await CalendarDAO.getAll();
  if (calendars) {
    res.json(calendars);
  } else {
    res.sendStatus(404);
  }
});

router.put('/:id', async (req, res, next) => {
  const calendar = await CalendarDAO.update(req.params.id, req.body);
  if (calendar) {
    res.json(calendar);
  } else {
    res.sendStatus(404);
  }
});

router.delete("/:id", async (req, res, next) => {
  const calendar = await CalendarDAO.delete(req.params.id);
  if (calendar) {
    res.sendStatus(200);
  } else {
    res.sendStatus(400);

  }
});

//***************Calendar.Event Routes

router.post("/:calId/events", async (req, res, next) => {
  const calId = req.params.calId;
  const { name, date } = req.body;
  if (!name) {
    res.status(400).send('body parameter "name" is required"');
  } else if (!date) {
    res.status(400).send('body parameter "date" is required"');
  } else {
    const event = await EventDAO.create(name, date, calId);
    res.json(event);
  }
});

router.get("/:calId/events/:id", async (req, res, next) => {
  const event = await EventDAO.getById(req.params.id);
  if (event) {
    res.json(event);
  } else {
    res.sendStatus(404);
  }
});

router.get("/:calId/events", async (req, res, next) => {
  const events = await EventDAO.getAll(req.params.calId);
  if (events && events.length > 0) {
    res.json(events);
  } else {
    res.sendStatus(404);
  }
});

router.put('/:calId/events/:id', async (req, res, next) => {
  const event = await EventDAO.update( req.params.id, req.body);
  if (event) {
    res.json(event);
  } else {
    res.sendStatus(404);
  }
});

router.delete("/:calId/events/:id", async (req, res, next) => {
  const event = await EventDAO.delete(req.params.id);
  if (event) {
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});


module.exports = router;
