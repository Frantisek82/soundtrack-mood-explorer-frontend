import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlaylistForm from "./PlaylistForm";

function renderPlaylistForm(
  overrides: Partial<React.ComponentProps<typeof PlaylistForm>> = {},
) {
  const props: React.ComponentProps<typeof PlaylistForm> = {
    name: "Focus",
    description: "Soundtracks for focused work",
    onNameChange: jest.fn(),
    onDescriptionChange: jest.fn(),
    onSubmit: jest.fn(),
    submitting: false,
    ...overrides,
  };

  render(<PlaylistForm {...props} />);

  return props;
}

describe("PlaylistForm", () => {
  it("renders accessible name and description fields", () => {
    renderPlaylistForm();

    expect(screen.getByRole("textbox", { name: /playlist name/i })).toHaveValue(
      "Focus",
    );

    expect(
      screen.getByRole("textbox", { name: /description \(optional\)/i }),
    ).toHaveValue("Soundtracks for focused work");

    expect(
      screen.getByRole("textbox", { name: /playlist name/i }),
    ).toBeRequired();
  });

  it("reports changes to both fields", async () => {
    const user = userEvent.setup();
    const props = renderPlaylistForm({
      name: "",
      description: "",
    });

    await user.type(
      screen.getByRole("textbox", { name: /playlist name/i }),
      "Focus",
    );
    await user.type(
      screen.getByRole("textbox", { name: /description \(optional\)/i }),
      "Calm music",
    );

    expect(props.onNameChange).toHaveBeenCalled();
    expect(props.onNameChange).toHaveBeenLastCalledWith("s");

    expect(props.onDescriptionChange).toHaveBeenCalled();
    expect(props.onDescriptionChange).toHaveBeenLastCalledWith("c");
  });

  it("submits the form", () => {
    const props = renderPlaylistForm();
    const form = screen
      .getByRole("button", { name: /create playlist/i })
      .closest("form");

    expect(form).not.toBeNull();

    fireEvent.submit(form!);

    expect(props.onSubmit).toHaveBeenCalledTimes(1);
  });

  it("disables submission when the name is blank", () => {
    renderPlaylistForm({
      name: "   ",
    });

    expect(
      screen.getByRole("button", { name: /create playlist/i }),
    ).toBeDisabled();
  });

  it("shows the loading state and disables actions while submitting", () => {
    renderPlaylistForm({
      submitting: true,
      onCancel: jest.fn(),
    });

    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();

    expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled();
  });

  it("renders an accessible error associated with the form", () => {
    renderPlaylistForm({
      error: "Failed to save playlist.",
    });

    const alert = screen.getByRole("alert");
    const form = screen
      .getByRole("button", { name: /create playlist/i })
      .closest("form");

    expect(alert).toHaveTextContent("Failed to save playlist.");
    expect(form).toHaveAttribute("aria-describedby", alert.id);
  });

  it("uses custom action labels and calls onCancel", async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();

    renderPlaylistForm({
      submitLabel: "Save Changes",
      cancelLabel: "Discard",
      onCancel,
    });

    expect(
      screen.getByRole("button", { name: /save changes/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /discard/i }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("does not render a cancel button when onCancel is omitted", () => {
    renderPlaylistForm();

    expect(
      screen.queryByRole("button", { name: /cancel/i }),
    ).not.toBeInTheDocument();
  });
});
