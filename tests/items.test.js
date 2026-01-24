import test, { after, afterEach, before } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../src/app.js";
import { clearTestDb, setupTestDb, teardownTestDb } from "./helpers/test-db.js";

const userPayload = {
  username: "itemowner",
  email: "itemowner@example.com",
  password: "Password123!",
  fullName: "Item Owner",
  phoneNumber: "0911111111",
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

test("creates an item and lists it in my items", async () => {
  const token = await createAndLogin();
  assert.ok(token);

  const createRes = await request(app)
    .post("/api/v1/items")
    .set("Authorization", `Bearer ${token}`)
    .field("title", "Winter Jacket")
    .field("description", "Warm and clean")
    .field("category", "Clothing")
    .field("condition", "used");

  assert.equal(createRes.status, 201);
  assert.equal(createRes.body?.data?.title, "Winter Jacket");

  const listRes = await request(app)
    .get("/api/v1/items/mine")
    .set("Authorization", `Bearer ${token}`);

  assert.equal(listRes.status, 200);
  assert.equal(listRes.body?.data?.length, 1);
});
