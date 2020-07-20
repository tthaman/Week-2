
const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');

describe("/events", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);

  afterEach(testUtils.clearDB)

  describe('POST Events', () => {
    let calendar1;

    beforeAll(async () => {
      calendar1 = (await request(server).post("/calendars").send({ name: 'calendar1' })).body;
    });

    describe("GET /:calId/events/:id", () => {
      it("should return 404 if no matching id", async () => {
        const res = await request(server).get("/calendars/" + calendar1._id + "/events/id1");
        expect(res.statusCode).toEqual(404);
      });
    });

    describe('POST /events', () => {
      it('should return a 400 without a provided name', async () => {
        const res = await request(server).post("/calendars/" + calendar1._id + "/events").send({});
        expect(res.statusCode).toEqual(400);
      });
    });

    describe('GET /:id after multiple POST /', () => {
      let event1, event2;
      const aDate = new Date().toDateString();

      beforeEach(async () => {
        event1 = (await request(server).post("/calendars/" + calendar1._id + "/events").send(
          {name: 'event1', date: aDate, calendarId: calendar1._id })).body;
        event2 = (await request(server).post("/calendars/" + calendar1._id + "/events").send(
          {name: 'event2', date: aDate, calendarId: calendar1._id})).body;
      });

      it('should return event1 using its id', async () => {
        const res = await request(server).get("/calendars/" + calendar1._id + "/events/" + event1._id);
        expect(res.statusCode).toEqual(200);
        const storedEvent = res.body;
        expect(storedEvent).toMatchObject({
          name: 'event1',
          _id: event1._id,
          date: aDate,
          calendarId: calendar1._id
        });
      });

      it('should return event2 using its id', async () => {
        const res = await request(server).get("/calendars/" + calendar1._id + "/events/" + event2._id);
        expect(res.statusCode).toEqual(200);
        const storedEvent = res.body;
        expect(storedEvent).toMatchObject({
          name: 'event2',
          _id: event2._id,
          date: aDate,
          calendarId: calendar1._id
        });
      });
    });

    describe('GET / all events...return error /', () => {
      it('should return all events', async () => {
        const res = await request(server).get("/calendars/" + calendar1._id + "/events/");
        expect(res.statusCode).toEqual(404);
      });
    });

    describe('GET / after multiple POST /', () => {
      let event1, event2;
      const aDate = new Date().toDateString();

      beforeEach(async () => {
        event1 = (await request(server).post("/calendars/" + calendar1._id + "/events").send(
          {name: 'event1', date: aDate, calendarId: calendar1._id })).body;
        event2 = (await request(server).post("/calendars/" + calendar1._id + "/events").send(
          {name: 'event2', date: aDate, calendarId: calendar1._id})).body;
      });

      it('should return all events', async () => {
        const res = await request(server).get("/calendars/" + calendar1._id + "/events/");
        expect(res.statusCode).toEqual(200);
        const storedEvents = res.body;
        expect(storedEvents).toMatchObject([event1, event2]);
      });
    });

    describe('PUT /calId:/event/:id after POST /', () => {
      let event1;
      let aDate = new Date().toDateString();

      beforeEach(async () => {
        event1 = (await request(server).post("/calendars/" + calendar1._id + "/events").send(
        {name: 'event1', date: aDate, calendarId: calendar1._id })).body;
      });

      it('should store and return event1 with new name', async () => {
        const res = await request(server)
          .put("/calendars/"+ calendar1._id +"/events/" + event1._id)
          .send({name: 'new name'});
        expect(res.statusCode).toEqual(200);

        const storedEvent = (await request(server).get("/calendars/" + calendar1._id + "/events/" + event1._id)).body;
        expect(storedEvent).toMatchObject({
          name: 'new name',
          _id: event1._id,
          date: aDate,
          calendarId: calendar1._id
        });
      });
    });

    describe('DELETE /event/:id after POST /', () => {
      let event1;
      const aDate = new Date().toDateString();

      beforeEach(async () => {
        event1 = (await request(server).post("/calendars/" + calendar1._id + "/events").send(
          {name: 'event1', date: aDate, calendarId: calendar1._id })).body;
      });

      it('should delete and not return calendar1 on next GET', async () => {
        const res = await request(server).delete("/calendars/" + calendar1._id + "/events/bob");
        expect(res.statusCode).toEqual(400);
      });

      it('should delete and not return calendar1 on next GET', async () => {
        const res = await request(server).delete("/calendars/" + calendar1._id + "/events/" + event1._id);
        expect(res.statusCode).toEqual(200);
        const storedEventResponse = (await request(server).get(
          "/calendars/" + calendar1._id + "/events/" + event1._id));
        expect(storedEventResponse.status).toEqual(404);
      });
    });
  });
});
