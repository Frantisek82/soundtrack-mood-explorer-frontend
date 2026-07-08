const API_URL = `${
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
}/contact`;

export type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export async function sendContactMessage(data: ContactFormData) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const response = await res.json();

  if (!res.ok) {
    throw new Error(response.message || "Failed to send message.");
  }

  return response;
}
