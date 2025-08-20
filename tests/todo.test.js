import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import User from "../models/User.js";
import Todo from "../models/Todo.js";

let token;
let todoId;

beforeAll(async () => {
  await User.deleteMany();
  await Todo.deleteMany();

  // Register user
  const userRes = await request(app).post("/api/auth/register").send({
    username: "Test User",
    email: "testtodo@example.com",
    password: "password123",
  });
  expect(userRes.statusCode).toBe(201);

  // Login untuk dapatkan token
  const loginRes = await request(app).post("/api/auth/login").send({
    email: "testtodo@example.com",
    password: "password123",
  });
  expect(loginRes.statusCode).toBe(201);
  token = loginRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Todo API", () => {
  it("should create a new todo", async () => {
    const res = await request(app)
      .post("/api/todos/create")
      .set("Cookie", [`token=${token}`])

      .send({
        title: "Belajar Testing",
        description: "Membuat unit test untuk todo app",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Belajar Testing");
    todoId = res.body._id;
  });

  it("should get all todos for user", async () => {
    const res = await request(app)
      .get("/api/todos")
      .set("Cookie", [`token=${token}`]);
    expect(res.statusCode).toBe(201);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should get a single todo by id", async () => {
    const res = await request(app)
      .get(`/api/todos/${todoId}`)
      .set("Cookie", [`token=${token}`]);
    expect(res.statusCode).toBe(201);
    expect(res.body._id).toBe(todoId);
  });

  it("should update a todo", async () => {
    const res = await request(app)
      .put(`/api/todos/update/${todoId}`)
      .set("Cookie", [`token=${token}`])

      .send({
        title: "Belajar Testing - Update",
        description: "Update todo description",
        completed: true,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Belajar Testing - Update");
    expect(res.body.completed).toBe(true);
  });

  it("should delete a todo", async () => {
    const res = await request(app)
      .delete(`/api/todos/delete/${todoId}`)
      .set("Cookie", [`token=${token}`]);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Todo berhasil dihapus");
  });

  it("should return 404 when getting deleted todo", async () => {
    const res = await request(app)
      .get(`/api/todos/${todoId}`)
      .set("Cookie", [`token=${token}`]);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Todo tidak ditemukan");
  });
});
