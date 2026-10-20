import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import PrivacyPage from "@/src/app/privacy/page";
import TermsPage from "@/src/app/terms/page";
import RegisterPage from "@/src/app/register/page";
import { registerUser } from "@/src/services/auth";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/src/services/auth", () => ({
  registerUser: jest.fn(),
}));

beforeEach(() => {
  jest.resetAllMocks();
});

it("identifies the maintainer and links privacy enquiries to Contact", () => {
  render(<PrivacyPage />);
  expect(screen.getByText(/maintained by František Babinský/))
    .toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Contact page" }))
    .toHaveAttribute("href", "/contact");
  expect(screen.getByText(/does not establish immediate removal from backups/))
    .toBeInTheDocument();
});

it("provides the Spotify protections and privacy link", () => {
  render(<TermsPage />);
  expect(screen.getByText(/third-party beneficiary/)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Privacy notice" }))
    .toHaveAttribute("href", "/privacy");
  expect(screen.getByText(/does not represent Spotify/)).toBeInTheDocument();
});

it("shows privacy and terms before registration", () => {
  render(<RegisterPage />);
  expect(screen.getByRole("link", { name: "Privacy notice" }))
    .toHaveAttribute("href", "/privacy");
  expect(screen.getByRole("link", { name: "Terms of use" }))
    .toHaveAttribute("href", "/terms");
  expect(screen.getByRole("checkbox")).toBeRequired();
  expect(screen.getByRole("checkbox")).not.toBeChecked();
});

it("requires agreement before submitting a valid registration", async () => {
  const user = userEvent.setup();
  render(<RegisterPage />);
  await user.type(screen.getByPlaceholderText("Name"), "Test User");
  await user.type(screen.getByPlaceholderText("Email"), "test@example.com");
  await user.type(screen.getByPlaceholderText("Password"), "test-password");
  await user.type(screen.getByPlaceholderText("Confirm password"), "test-password");
  await user.click(screen.getByRole("button", { name: "Register" }));
  expect(registerUser).not.toHaveBeenCalled();

  await user.click(screen.getByRole("checkbox"));
  await user.click(screen.getByRole("button", { name: "Register" }));
  expect(registerUser).toHaveBeenCalledWith({
    name: "Test User",
    email: "test@example.com",
    password: "test-password",
  });
});

it("discloses Resend and Gmail processing separately", () => {
  render(<PrivacyPage />);
  expect(screen.getByRole("heading", { name: "Contact messages and retention" }))
    .toBeInTheDocument();
  expect(screen.getByText(/Contact messages are sent through Resend/))
    .toHaveTextContent("Gmail");
  expect(screen.getByRole("link", { name: "Resend’s data-handling information" }))
    .toHaveAttribute("href", "https://resend.com/security/gdpr");
  expect(screen.getByRole("link", { name: "Google’s Privacy Policy" }))
    .toHaveAttribute("href", "https://policies.google.com/privacy");
});

it("explains manual mailbox retention and separate contact-data deletion", () => {
  render(<PrivacyPage />);
  expect(screen.getByText(/within 30 days after resolution/))
    .toHaveTextContent("manual policy, not an automated deletion feature");
  expect(screen.getByText(/Application-account deletion does not automatically/))
    .toHaveTextContent("contact correspondence");
});
