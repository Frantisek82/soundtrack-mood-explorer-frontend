import { render, screen } from "@testing-library/react";
import SoundtrackCardSkeleton from "./SoundtrackCardSkeleton";

describe("SoundtrackCardSkeleton", () => {
    it("renders the skeleton container", () => {
        render(<SoundtrackCardSkeleton />);

        const skeleton = screen.getByRole("presentation", { hidden: true });

        expect(skeleton).toBeInTheDocument();
    });

    it("is hidden from assistive technologies", () => {
        render(<SoundtrackCardSkeleton />);

        const skeleton = screen.getByRole("presentation", { hidden: true });

        expect(skeleton).toHaveAttribute("aria-hidden", "true");
    });

    it("applies the loading animation class", () => {
        render(<SoundtrackCardSkeleton />);

        const skeleton = screen.getByRole("presentation", { hidden: true });

        expect(skeleton).toHaveClass("animate-pulse");
    });

    it("renders the expected placeholder structure", () => {
        render(<SoundtrackCardSkeleton />);

        const skeleton = screen.getByRole("presentation", { hidden: true });

        expect(skeleton.children).toHaveLength(3);

        const moodTags = skeleton.children[2];

        expect(skeleton.children).toHaveLength(3);
    });

    it("is hidden from assistive technologies", () => {
        render(<SoundtrackCardSkeleton />);

        const skeleton = screen.getByRole("presentation", { hidden: true });

        expect(skeleton).toHaveAttribute("role", "presentation");
        expect(skeleton).toHaveAttribute("aria-hidden", "true");
    });
});