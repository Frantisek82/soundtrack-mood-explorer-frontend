import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "./Navbar";
import { isAuthenticated, logout } from "@/src/utils/auth";
import { usePathname, useRouter } from "next/navigation";

jest.mock("next/link", () => ({
    __esModule: true,
    default: ({ href, children, onClick, ...props }: any) => (
        <a
            href={href}
            onClick={(e) => {
                e.preventDefault();
                onClick?.(e);
            }}
            {...props}
        >
            {children}
        </a>
    ),
}));

jest.mock("next/navigation", () => ({
    usePathname: jest.fn(),
    useRouter: jest.fn(),
}));

jest.mock("@/src/utils/auth", () => ({
    isAuthenticated: jest.fn(),
    logout: jest.fn(),
}));

const mockPush = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();

    (usePathname as jest.Mock).mockReturnValue("/");
    (useRouter as jest.Mock).mockReturnValue({
        push: mockPush,
    });
});

describe("Navbar", () => {
    it("renders nothing while authentication is loading", () => {
        (isAuthenticated as jest.Mock).mockReturnValue(new Promise(() => { }));

        const { container } = render(<Navbar />);

        expect(container.firstChild).toBeNull();
    });

    it("renders guest navigation when not authenticated", async () => {
        (isAuthenticated as jest.Mock).mockResolvedValue(false);

        render(<Navbar />);

        expect(await screen.findByText("Soundtrack Mood Explorer")).toBeInTheDocument();

        expect(screen.getAllByText("Explore")[0]).toBeInTheDocument();
        expect(screen.getAllByText("Contact")[0]).toBeInTheDocument();

        expect(screen.getAllByText("Login")[0]).toBeInTheDocument();
        expect(screen.getAllByText("Register")[0]).toBeInTheDocument();

        expect(screen.queryByText("Favorites")).not.toBeInTheDocument();
        expect(screen.queryByText("Profile")).not.toBeInTheDocument();
        expect(screen.queryByText("Logout")).not.toBeInTheDocument();
    });

    it("renders authenticated navigation", async () => {
        (isAuthenticated as jest.Mock).mockResolvedValue(true);

        render(<Navbar />);

        expect(await screen.findByText("Favorites")).toBeInTheDocument();
        expect(screen.getByText("Profile")).toBeInTheDocument();
        expect(screen.getByText("Logout")).toBeInTheDocument();

        expect(screen.queryByText("Login")).not.toBeInTheDocument();
        expect(screen.queryByText("Register")).not.toBeInTheDocument();
    });

    it("highlights the active link", async () => {
        (usePathname as jest.Mock).mockReturnValue("/explore");
        (isAuthenticated as jest.Mock).mockResolvedValue(false);

        render(<Navbar />);

        const explore = await screen.findAllByText("Explore");

        expect(explore[0]).toHaveClass("font-semibold");
    });

    it("toggles the mobile menu", async () => {
        const user = userEvent.setup();

        (isAuthenticated as jest.Mock).mockResolvedValue(false);

        render(<Navbar />);

        await screen.findByText("Login");

        const button = screen.getByRole("button", {
            name: /toggle menu/i,
        });

        expect(screen.getAllByText("Explore")).toHaveLength(1);

        await user.click(button);

        expect(screen.getAllByText("Explore")).toHaveLength(2);

        await user.click(button);

        await waitFor(() => {
            expect(screen.getAllByText("Explore")).toHaveLength(1);
        });
    });

    it("logs out and redirects to login", async () => {
        const user = userEvent.setup();

        (isAuthenticated as jest.Mock).mockResolvedValue(true);
        (logout as jest.Mock).mockResolvedValue(undefined);

        render(<Navbar />);

        const logoutButton = await screen.findByText("Logout");

        await user.click(logoutButton);

        expect(logout).toHaveBeenCalledTimes(1);

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith("/login");
        });
    });

    it("closes the mobile menu when a guest link is clicked", async () => {
        const user = userEvent.setup();

        (isAuthenticated as jest.Mock).mockResolvedValue(false);

        render(<Navbar />);

        await screen.findByText("Login");

        await user.click(
            screen.getByRole("button", { name: /toggle menu/i })
        );

        expect(screen.getAllByText("Explore")).toHaveLength(2);

        await user.click(screen.getAllByText("Explore")[1]);

        await waitFor(() => {
            expect(screen.getAllByText("Explore")).toHaveLength(1);
        });
    });

    it("closes the mobile menu when an authenticated link is clicked", async () => {
        const user = userEvent.setup();

        (isAuthenticated as jest.Mock).mockResolvedValue(true);

        render(<Navbar />);

        await screen.findByText("Logout");

        await user.click(
            screen.getByRole("button", { name: /toggle menu/i })
        );

        expect(screen.getAllByText("Favorites")).toHaveLength(2);

        await user.click(screen.getAllByText("Favorites")[1]);

        await waitFor(() => {
            expect(screen.getAllByText("Favorites")).toHaveLength(1);
        });
    });

    it("logs out from the mobile menu", async () => {
        const user = userEvent.setup();

        (isAuthenticated as jest.Mock).mockResolvedValue(true);
        (logout as jest.Mock).mockResolvedValue(undefined);

        render(<Navbar />);

        await screen.findByText("Logout");

        await user.click(
            screen.getByRole("button", { name: /toggle menu/i })
        );

        await user.click(screen.getAllByText("Logout")[1]);

        expect(logout).toHaveBeenCalledTimes(1);

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith("/login");
        });
    });

    it("closes the menu when Login is clicked", async () => {
        const user = userEvent.setup();

        (isAuthenticated as jest.Mock).mockResolvedValue(false);

        render(<Navbar />);

        await screen.findByText("Login");

        await user.click(screen.getByRole("button", { name: /toggle menu/i }));

        await user.click(screen.getAllByText("Login")[1]);

        await waitFor(() => {
            expect(screen.getAllByText("Login")).toHaveLength(1);
        });
    });

    it("closes the menu when Profile is clicked", async () => {
        const user = userEvent.setup();

        (isAuthenticated as jest.Mock).mockResolvedValue(true);

        render(<Navbar />);

        await screen.findByText("Logout");

        await user.click(screen.getByRole("button", { name: /toggle menu/i }));

        await user.click(screen.getAllByText("Profile")[1]);

        await waitFor(() => {
            expect(screen.getAllByText("Profile")).toHaveLength(1);
        });
    });
});