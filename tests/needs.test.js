import test, { after, afterEach, before } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../src/app.js";
import { clearTestDb, setupTestDb, teardownTestDb } from "./helpers/test-db.js";

const userPayload = {
  username: "needuser",
  email: "needuser@example.com",
  password: "Password123!",
  fullName: "Need User",
  phoneNumber: "0922222222",
  address: "Addis Ababa"
};

const createAndLogin = async () => {
  await request(app).post("/api/v1/auth/register").send(userPayload);
  const res = await request(app)
    .post("/api/v1/auth/login")
    .send({ email: userPayload.email, password: userPayload.password });
  return res.body?.data?.accessToken;
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

test("creates a request and lists it in my requests", async () => {
  const token = await createAndLogin();
  assert.ok(token);

  const createRes = await request(app)
    .post("/api/v1/needs")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "School Backpack",
      description: "Need a backpack for school",
      category: "Education"
    });

  assert.equal(createRes.status, 201);
  assert.equal(createRes.body?.data?.title, "School Backpack");

  const listRes = await request(app)
    .get("/api/v1/needs/mine")
    .set("Authorization", `Bearer ${token}`);

  assert.equal(listRes.status, 200);
  assert.equal(listRes.body?.data?.length, 1);
});
