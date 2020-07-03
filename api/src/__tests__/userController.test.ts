import fastify from "../index";

import { prisma } from "generated/prisma-client";

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
    await prisma.deleteManyEntries({});
  });

  it("GET will returns 200 and all entries", async (done) => {
    fastify.inject({
      method: "GET",
      url: "/entries",
    });
  });
});
