import { render, screen } from "@testing-library/react";
import EmptyState from "./EmptyState";

describe("EmptyState", () => {
  it("renders the title and description", () => {
    render(
      <EmptyState
        title="No favorites yet"
        description="Start exploring to add your favorite soundtracks."
      />
    );

    expect(
      screen.getByRole("heading", { name: /no favorites yet/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/start exploring to add your favorite soundtracks/i)
    ).toBeInTheDocument();
  });

  it("does not render a button when no button props are provided", () => {
    render(
      <EmptyState
        title="Nothing here"
        description="There is currently no content."
      />
    );

    expect(
      screen.queryByRole("link")
    ).not.toBeInTheDocument();
  });

  it("renders an action link when buttonText and buttonHref are provided", () => {
    render(
      <EmptyState
        title="No results"
        description="Try another search."
        buttonText="Go home"
        buttonHref="/"
      />
    );

    const link = screen.getByRole("link", {
      name: /go home/i,
    });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });
});