import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "./Button";

describe("Button", () => {
    it("renders its children", () => {
        render(<Button>Save</Button>);

        expect(
            screen.getByRole("button", { name: /save/i })
        ).toBeInTheDocument();
    });

    it("uses type='button' by default", () => {
        render(<Button>Save</Button>);

        expect(screen.getByRole("button")).toHaveAttribute(
            "type",
            "button"
        );
    });

    it("accepts a custom button type", () => {
        render(<Button type="submit">Submit</Button>);

        expect(screen.getByRole("button")).toHaveAttribute(
            "type",
            "submit"
        );
    });

    it("calls onClick when clicked", async () => {
        const user = userEvent.setup();
        const handleClick = jest.fn();

        render(<Button onClick={handleClick}>Save</Button>);

        await user.click(screen.getByRole("button"));

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("is disabled when disabled prop is provided", () => {
        render(<Button disabled>Save</Button>);

        expect(screen.getByRole("button")).toBeDisabled();
    });

    it("is disabled while loading", () => {
        render(<Button loading>Save</Button>);

        expect(screen.getByRole("button")).toBeDisabled();
    });

    it("shows loading text while loading", () => {
        render(<Button loading>Save</Button>);

        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it("does not render children while loading", () => {
        render(<Button loading>Save</Button>);

        expect(screen.queryByText(/save/i)).not.toBeInTheDocument();
    });

    it("applies the danger variant", () => {
        render(<Button variant="danger">Delete</Button>);

        expect(screen.getByRole("button")).toHaveClass("text-red-400");
    });
});