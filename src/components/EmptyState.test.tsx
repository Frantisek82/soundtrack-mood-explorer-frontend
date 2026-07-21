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
});