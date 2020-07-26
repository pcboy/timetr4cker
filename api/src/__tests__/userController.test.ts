import fastify from "../index";
import { Entry } from "models/entry";

beforeAll(async () => {
  fastify.ready();
});

afterAll(async (done) => {
  await fastify.close();
  done();
});

describe("/entries", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    await Entry.drop();
  });

  it("GET will returns 200 and all entries", async (done) => {
    fastify.inject({
      method: "GET",
      url: "/entries",
    });
  });
});
