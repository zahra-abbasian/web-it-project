const mongoose = require("mongoose");
require("dotenv").config();
const { updateVanStatus } = require("../controllers/vanController");
const Van = require("../models/van");

describe("Unit testing Update Van Status Controller function", () => {
  const response = {
    success: true,
    data: {
      location: { type: "Point", coordinates: [30, -90] },
      address: "on Grattan st outside Melbourne Uni",
      ready: true,
      _id: "6073132260a08dbb48acd5f6",
      name: "yanghak",
    },
  };

  const req = {
    body: {
      address: "",
      ready: true,
      location: {
        type: "Point",
        coordinates: [144.96305759999998, -37.8136276],
      },
    },
    params: {
      id: "6073132260a08dbb48acd5f6",
    },
  };

  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  const next = jest.fn();

  let db;
  beforeAll(async () => {
    await mongoose.connect(process.env.CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "Trukk",
    });
    db = mongoose.connection;

    res.json.mockClear();

    Van.updateOne = jest.fn().mockResolvedValue({
      nModified: true,
    });

    Van.findById = jest.fn().mockResolvedValue(response.data);

    await updateVanStatus(req, res, next);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("Update van status to ready when it was not ready", async () => {
    expect(Van.updateOne).toHaveBeenCalledTimes(1);
    expect(Van.findById).toHaveBeenCalledTimes(1);
    expect(next).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(response);
  });
  it("Update van status but the status is not modified", async () => {
    // when van is not modified
    Van.updateOne = jest.fn().mockResolvedValue({
      nModified: false,
    });

    await updateVanStatus(req, res, next);

    expect(res.json).toHaveBeenCalledWith({ ...response, success: false });
  });
});

describe("Unit testing Update Van Status Controller function with incorrect ID", () => {
  const req = {
    body: {
      address: "",
      ready: true,
      location: {
        type: "Point",
        coordinates: [144.96305759999998, -37.8136276],
      },
    },
    params: {
      id: "123",
    },
  };

  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  const next = jest.fn();

  let db;
  beforeAll(async () => {
    await mongoose.connect(process.env.CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "Trukk",
    });
    db = mongoose.connection;

    res.json.mockClear();

    Van.updateOne = jest.fn().mockResolvedValue({
      nModified: true,
    });

    Van.findById = jest.fn().mockImplementationOnce(() => {
      throw new Error();
    });

    updateVanStatus(req, res, next);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("Update van status to ready when it was not ready", async () => {
    expect(Van.updateOne).toHaveBeenCalledTimes(1);
    expect(Van.findById).toHaveBeenCalledTimes(1);
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });
});
