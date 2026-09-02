import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlaylistCard from "./PlaylistCard";
import type { Playlist } from "@/src/types/playlist";

const playlist: Playlist = {
  _id: "playlist123",
  name: "Focus",
  description: "Soundtracks for focused work",
  soundtracks: ["track123", "track456"],
  createdAt: "2026-08-01T10:00:00.000Z",
  updatedAt: "2026-08-01T10:00:00.000Z",
};

function renderPlaylistCard(
  overrides: Partial<React.ComponentProps<typeof PlaylistCard>> = {},
) {
  const props: React.ComponentProps<typeof PlaylistCard> = {
    playlist,
    onDelete: jest.fn(),
    onUpdate: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  };

  render(<PlaylistCard {...props} />);

  return props;
}

describe("PlaylistCard", () => {
  it("renders playlist information and accessible actions", () => {
    renderPlaylistCard();

    expect(screen.getByRole("heading", { name: "Focus" })).toBeInTheDocument();

    expect(screen.getByRole("heading", { name: "Focus" })).toHaveClass(
      "text-white",
    );

    expect(
      screen.getByText("Soundtracks for focused work"),
    ).toBeInTheDocument();

    expect(screen.getByText("2 soundtracks")).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: /open playlist focus/i }),
    ).toHaveAttribute("href", "/playlists/playlist123");

    expect(
      screen.getByRole("button", { name: /edit playlist focus/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /delete playlist focus/i }),
    ).toBeInTheDocument();
  });

  it("uses the singular soundtrack label for one soundtrack", () => {
    renderPlaylistCard({
      playlist: {
        ...playlist,
        soundtracks: ["track123"],
      },
    });

    expect(screen.getByText("1 soundtrack")).toBeInTheDocument();
  });

  it("handles a missing description and an empty playlist", () => {
    renderPlaylistCard({
      playlist: {
        ...playlist,
        description: undefined,
        soundtracks: [],
      },
    });

    expect(
      screen.queryByText("Soundtracks for focused work"),
    ).not.toBeInTheDocument();

    expect(screen.getByText("0 soundtracks")).toBeInTheDocument();
  });

  it("calls onDelete with the playlist ID", async () => {
    const user = userEvent.setup();
    const props = renderPlaylistCard();

    await user.click(
      screen.getByRole("button", { name: /delete playlist focus/i }),
    );

    expect(props.onDelete).toHaveBeenCalledTimes(1);
    expect(props.onDelete).toHaveBeenCalledWith("playlist123");
  });

  it("opens an accessible edit form with the current values", async () => {
    const user = userEvent.setup();

    renderPlaylistCard();

    await user.click(
      screen.getByRole("button", { name: /edit playlist focus/i }),
    );

    expect(screen.getByRole("textbox", { name: /playlist name/i })).toHaveValue(
      "Focus",
    );

    expect(
      screen.getByRole("textbox", { name: /description \(optional\)/i }),
    ).toHaveValue("Soundtracks for focused work");

    expect(
      screen.getByRole("button", { name: /save changes/i }),
    ).toBeInTheDocument();
  });

  it("trims edited values and updates the playlist", async () => {
    const user = userEvent.setup();
    const props = renderPlaylistCard();

    await user.click(
      screen.getByRole("button", { name: /edit playlist focus/i }),
    );

    const nameInput = screen.getByRole("textbox", {
      name: /playlist name/i,
    });
    const descriptionInput = screen.getByRole("textbox", {
      name: /description \(optional\)/i,
    });

    await user.clear(nameInput);
    await user.type(nameInput, "  Deep Focus  ");

    await user.clear(descriptionInput);
    await user.type(descriptionInput, "  Calm soundtracks  ");

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(props.onUpdate).toHaveBeenCalledWith("playlist123", {
        name: "Deep Focus",
        description: "Calm soundtracks",
      });
    });

    expect(
      screen.queryByRole("button", { name: /save changes/i }),
    ).not.toBeInTheDocument();
  });

  it("cancels editing and restores the original values", async () => {
    const user = userEvent.setup();

    renderPlaylistCard();

    await user.click(
      screen.getByRole("button", { name: /edit playlist focus/i }),
    );

    const nameInput = screen.getByRole("textbox", {
      name: /playlist name/i,
    });

    await user.clear(nameInput);
    await user.type(nameInput, "Changed name");

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    await user.click(
      screen.getByRole("button", { name: /edit playlist focus/i }),
    );

    expect(screen.getByRole("textbox", { name: /playlist name/i })).toHaveValue(
      "Focus",
    );
  });

  it("shows an accessible error when updating fails", async () => {
    const user = userEvent.setup();
    const onUpdate = jest.fn().mockRejectedValue(new Error("Request failed"));

    renderPlaylistCard({ onUpdate });

    await user.click(
      screen.getByRole("button", { name: /edit playlist focus/i }),
    );

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Failed to update playlist. Please try again.",
    );

    expect(
      screen.getByRole("button", { name: /save changes/i }),
    ).toBeInTheDocument();
  });
});
