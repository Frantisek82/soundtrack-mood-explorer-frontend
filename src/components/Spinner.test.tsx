import { render, screen } from "@testing-library/react";
import Spinner from "./Spinner";

describe("Spinner", () => {
  it("renders with the default medium size", () => {
    render(<Spinner />);

    const spinner = screen.getByRole("status", {
      name: /loading/i,
    });

    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("h-6", "w-6", "border-2");
  });

  it("renders with the small size", () => {
    render(<Spinner size="sm" />);

    expect(
      screen.getByRole("status")
    ).toHaveClass("h-4", "w-4", "border-2");
  });

  it("renders with the large size and custom class name", () => {
    render(<Spinner size="lg" className="my-spinner" />);

    expect(
      screen.getByRole("status")
    ).toHaveClass("h-10", "w-10", "border-4", "my-spinner");
  });
});