import request from "supertest";
import app from "../../app.js";
import { User } from "../../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../config/config.js";
import { sequelize } from "../../config/config.js";

describe("Auth Controller", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await User.destroy({ where: { username: "testuser" } });
    await User.destroy({ where: { username: "existing" } });
    await sequelize.close();
  });

  describe("POST /auth/register", () => {
    it("should create a new user", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send({ username: "testuser", password: "password123" });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        "message",
        "User created successfully"
      );
      expect(response.body.user).toHaveProperty("username", "testuser");
    });

    it("should not create a user if username already exists", async () => {
      await User.create({
        username: "existing",
        password: await bcrypt.hash("pass", 8),
      });

      const response = await request(app)
        .post("/auth/register")
        .send({ username: "existing", password: "pass" });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty("message", "Username already taken");
    });
  });

  describe("POST /auth/login", () => {
    beforeAll(async () => {
      const hashedPassword = await bcrypt.hash("mypassword", 8);
      await User.create({ username: "loginuser", password: hashedPassword });
    });

    afterAll(async () => {
      await User.destroy({ where: { username: "loginuser" } });
    });

    it("should login a user with valid credentials", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ username: "loginuser", password: "mypassword" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      const decoded = jwt.verify(response.body.token, SECRET_KEY);
      expect(decoded).toHaveProperty("username", "loginuser");
    });

    it("should return 401 for invalid username", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ username: "unknown", password: "whatever" });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty(
        "message",
        "Invalid username or password"
      );
    });

    it("should return 401 for invalid password", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ username: "loginuser", password: "wrongpass" });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty(
        "message",
        "Invalid username or password"
      );
    });
  });

  describe("GET /auth/profile", () => {
    let token;
    let user;

    beforeAll(async () => {
      const hashedPassword = await bcrypt.hash("profilepass", 8);
      user = await User.create({
        username: "profileuser",
        password: hashedPassword,
      });
      token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
        expiresIn: "1h",
      });
    });

    afterAll(async () => {
      await user.destroy({ where: { username: "profileuser" } });
    });

    it("should return the user profile if authenticated", async () => {
      const response = await request(app)
        .get("/auth/profile")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty("id", user.id);
      expect(response.body.user).toHaveProperty("username", "profileuser");
    });

    it("should return 404 if user not found", async () => {
      await user.destroy();

      const response = await request(app)
        .get("/auth/profile")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "User not found");
    });

    it("should return 401 if token is missing or invalid", async () => {
      const response = await request(app).get("/auth/profile"); // no token

      expect(response.status).toBe(401);
    });
  });
});
