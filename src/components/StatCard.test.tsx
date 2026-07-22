import { render, screen } from "@testing-library/react";
import type { SVGProps } from "react";
import StatCard from "./StatCard";

function MockIcon(props: SVGProps<SVGSVGElement>) {
    return <svg data-testid="stat-icon" {...props} />;
}

describe("StatCard", () => {
    const defaultProps = {
        icon: MockIcon,
        label: "Tracks",
        value: 42,
    };

    it("renders the label", () => {
        render(<StatCard {...defaultProps} />);

        expect(screen.getByText("Tracks")).toBeInTheDocument();
    });

    it("renders the value", () => {
        render(<StatCard {...defaultProps} />);

        expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("renders the provided icon", () => {
        render(<StatCard {...defaultProps} />);

        const icon = screen.getByTestId("stat-icon");

        expect(icon).toBeInTheDocument();
        expect(icon).toHaveAttribute("aria-hidden", "true");
    });

    it("associates the article with its label", () => {
        render(<StatCard {...defaultProps} />);

        const article = screen.getByRole("article");
        const label = screen.getByText("Tracks");

        expect(article).toHaveAttribute("aria-labelledby", label.id);
    });

    it("renders string values", () => {
        render(
            <StatCard
                icon={MockIcon}
                label="Mood"
                value="Happy"
            />
        );

        expect(screen.getByText("Happy")).toBeInTheDocument();
    });
});