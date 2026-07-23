import { loginUser, logoutUser, registerUser } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

describe("auth service", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    const data = {
      name: "John",
      email: "john@example.com",
      password: "password123",
    };

    it("registers a user successfully", async () => {
      const response = { message: "Registered" };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(response),
      });

      await expect(registerUser(data)).resolves.toEqual(response);

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    });

    it("throws the API error message when registration fails", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue({
          message: "Email already exists",
        }),
      });

      await expect(registerUser(data)).rejects.toThrow("Email already exists");
    });

    it("throws a default error when the API message is missing", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue({}),
      });

      await expect(registerUser(data)).rejects.toThrow("Registration failed");
    });
  });

  describe("loginUser", () => {
    const data = {
      email: "john@example.com",
      password: "password123",
    };

    it("logs in successfully", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      });

      await expect(loginUser(data)).resolves.toBeUndefined();

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
    });

    it("throws the API error message when login fails", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue({
          message: "Invalid email or password",
        }),
      });

      await expect(loginUser(data)).rejects.toThrow(
        "Invalid email or password",
      );
    });

    it("throws the default login error when the API message is missing", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue({}),
      });

      await expect(loginUser(data)).rejects.toThrow("Invalid credentials");
    });
  });

  describe("logoutUser", () => {
    it("calls the logout endpoint", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({});

      await logoutUser();

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    });
  });
});
