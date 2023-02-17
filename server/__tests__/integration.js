const request = require("supertest");
const { app, server } = require("../app");

const body = {
  address: "on Grattan st outside Melbourne Uni",
  ready: true,
  location: {
    type: "Point",
    coordinates: [30, -90],
  },
};

const response = {
  success: true,
  data: {
    location: {
      type: "Point",
      coordinates: [30, -90],
    },
    address: "on Grattan st outside Melbourne Uni",
    ready: true,
    _id: "6073132260a08dbb48acd5f6",
    name: "yanghak",
  },
};

describe("Integration test: update van status (6073132260a08dbb48acd5f6)", () => {
  beforeAll(async () => {
    return await request(app)
      .patch("/vendor/van/status/6073132260a08dbb48acd5f6")
      .send({ ready: false });
  });

  afterAll(() => {
    server.close();
  });

  it("update van to ready", async () => {
    return await request(app)
      .patch("/vendor/van/status/6073132260a08dbb48acd5f6")
      .send(body)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.type).toBe("application/json");
        expect(res.body).toMatchObject(response);
      });
  });
  it("update van to ready when it is already ready", async () => {
    return await request(app)
      .patch("/vendor/van/status/6073132260a08dbb48acd5f6")
      .send(body)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.type).toBe("application/json");
        expect(res.body).toMatchObject({ ...response, success: false });
      });
  });
  it("update van to not ready", async () => {
    return await request(app)
      .patch("/vendor/van/status/6073132260a08dbb48acd5f6")
      .send({ ...body, ready: false })
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.type).toBe("application/json");
        expect(res.body).toMatchObject({
          ...response,
          data: { ...response.data, ready: false },
        });
      });
  });
  it("update van with incorrect location", async () => {
    return await request(app)
      .patch("/vendor/van/status/6073132260a08dbb48acd5f6")
      .send({ ...body, location: { type: "Point", coordinates: [999, 999] } })
      .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res.type).toBe("application/json");
        expect(res.body).toMatchObject({
          error: "Bad Request",
          status: "fail",
        });
      });
  });
});
