import test, { after, afterEach, before } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../src/app.js";
import { clearTestDb, setupTestDb, teardownTestDb } from "./helpers/test-db.js";

const userPayload = {
  username: "donoruser",
  email: "donor@example.com",
  password: "Password123!",
  fullName: "Donor User",
  phoneNumber: "0912345678",
  address: "Addis Ababa"
};

before(async () => {
  await setupTestDb();
});

after(async () => {
  await teardownTestDb();
});

afterEach(async () => {
  await clearTestDb();
});

test("registers a new user", async () => {
  const res = await request(app).post("/api/v1/auth/register").send(userPayload);
  assert.equal(res.status, 201);
  assert.ok(res.body?.data?.user);
  assert.equal(res.body?.data?.user?.email, userPayload.email);
});

test("logs in an existing user", async () => {
  await request(app).post("/api/v1/auth/register").send(userPayload);
  const res = await request(app)
    .post("/api/v1/auth/login")
    .send({ email: userPayload.email, password: userPayload.password });
  assert.equal(res.status, 200);
  assert.ok(res.body?.data?.accessToken);
});
