import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import User from "../models/User.js";

beforeAll(async () => {
  await User.deleteMany();
});

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth API", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User berhasil didaftarkan");
  });

  it("should not allow duplicate registration with same email", async () => {
    // Daftar pertama
    await request(app).post("/api/auth/register").send({
      username: "Test User",
      email: "duplicate@example.com",
      password: "password123",
    });

    // Daftar kedua dengan email sama
    const res = await request(app).post("/api/auth/register").send({
      username: "Another User",
      email: "duplicate@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Email sudah terdaftar");
  });

  it("should login with correct credentials", async () => {
    await request(app).post("/api/auth/register").send({
      username: "Login User",
      email: "login@example.com",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "login@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Login berhasil");
    expect(res.body.token).toBeDefined();
  });

  it("should reject login with wrong password", async () => {
    // Daftar dulu
    await request(app).post("/api/auth/register").send({
      username: "WrongPass User",
      email: "wrongpass@example.com",
      password: "password123",
    });

    // Login dengan password salah
    const res = await request(app).post("/api/auth/login").send({
      email: "wrongpass@example.com",
      password: "wrongpass",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Password salah");
  });

  it("should reject login with unknown email", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "notfound@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Email tidak ditemukan");
  });

  it("should logout successfully", async () => {
    // Daftar & login dulu
    await request(app).post("/api/auth/register").send({
      username: "Logout User",
      email: "logout@example.com",
      password: "password123",
    });

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "logout@example.com",
      password: "password123",
    });

    const token = loginRes.body.token;

    // Logout
    const res = await request(app)
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Logout berhasil");
  });
});
