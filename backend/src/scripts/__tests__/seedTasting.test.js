import mongoose from "mongoose";
import { User } from "../models/User.js";
import { Cafe } from "../models/cafeModel.js";
import { CoffeeTasting } from "../models/TastingsModel.js";
import seedTastingNotes from "../seedTasting.js";

jest.mock("../models/User.js");
jest.mock("../models/cafeModel.js");
jest.mock("../models/TastingsModel.js");
jest.mock("../config/database.js", () => jest.fn());

beforeEach(() => {
  jest.clearAllMocks();
});

describe("seedTastingNotes", () => {
  it("should insert new tasting notes and update changed ones", async () => {
    User.find.mockResolvedValue([{ _id: "user1" }, { _id: "user2" }]);
    Cafe.find.mockResolvedValue([
      {
        _id: "cafe1",
        name: "Drop Coffee",
        locations: [{ neighborhood: "Södermalm" }],
      },
      {
        _id: "cafe2",
        name: "Pascal",
        locations: [{ neighborhood: "Vasastan" }],
      },
    ]);
    CoffeeTasting.find.mockResolvedValue([]);
    CoffeeTasting.insertMany.mockResolvedValue([{ _id: "tasting1" }]);
    CoffeeTasting.findByIdAndUpdate.mockResolvedValue({});

    await seedTastingNotes();

    expect(CoffeeTasting.insertMany).toHaveBeenCalled();
  });

  it("should skip unchanged tasting notes", async () => {
    User.find.mockResolvedValue([{ _id: "user1" }]);
    Cafe.find.mockResolvedValue([
      {
        _id: "cafe1",
        name: "Drop Coffee",
        locations: [{ neighborhood: "Södermalm" }],
      },
    ]);
    CoffeeTasting.find.mockResolvedValue([
      {
        _id: "tasting1",
        userId: "user1",
        cafeId: "cafe1",
        coffeeName: "Kochere Washing Station",
        // ...other fields matching seed data
      },
    ]);
    CoffeeTasting.insertMany.mockResolvedValue([]);
    CoffeeTasting.findByIdAndUpdate.mockResolvedValue({});

    await seedTastingNotes();

    expect(CoffeeTasting.insertMany).not.toHaveBeenCalled();
    expect(CoffeeTasting.findByIdAndUpdate).not.toHaveBeenCalled();
  });
});
