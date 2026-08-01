import { sendContactMessage } from "./contact";

describe("contact service", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const contactData = {
    name: "John Doe",
    email: "john@example.com",
    subject: "Test Subject",
    message: "Test message",
  };

  it("should send a contact message successfully", async () => {
    const mockResponse = {
      message: "Message sent successfully.",
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    await expect(sendContactMessage(contactData)).resolves.toEqual(
      mockResponse,
    );

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/contact"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      },
    );
  });

  it("should throw the API error message", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({
        message: "Unable to send message.",
      }),
    });

    await expect(sendContactMessage(contactData)).rejects.toThrow(
      "Unable to send message.",
    );
  });

  it("should throw the default error message", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({}),
    });

    await expect(sendContactMessage(contactData)).rejects.toThrow(
      "Failed to send message.",
    );
  });
});
