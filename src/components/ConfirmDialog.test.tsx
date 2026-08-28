import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfirmDialog from "./ConfirmDialog";

function renderConfirmDialog(
  overrides: Partial<React.ComponentProps<typeof ConfirmDialog>> = {},
) {
  const props: React.ComponentProps<typeof ConfirmDialog> = {
    open: true,
    title: "Delete playlist?",
    description: "This action cannot be undone.",
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
    ...overrides,
  };

  const view = render(<ConfirmDialog {...props} />);

  return {
    ...view,
    props,
  };
}

describe("ConfirmDialog", () => {
  it("does not render when closed", () => {
    renderConfirmDialog({
      open: false,
    });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders an accessible modal dialog", () => {
    renderConfirmDialog();

    const dialog = screen.getByRole("dialog", {
      name: "Delete playlist?",
      description: "This action cannot be undone.",
    });

    expect(dialog).toHaveAttribute("aria-modal", "true");

    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /confirm/i }),
    ).toBeInTheDocument();
  });

  it("uses custom labels and exposes errors as alerts", () => {
    renderConfirmDialog({
      confirmLabel: "Delete",
      cancelLabel: "Keep playlist",
      error: "Failed to delete playlist.",
    });

    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /keep playlist/i }),
    ).toBeInTheDocument();

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Failed to delete playlist.",
    );
  });

  it("calls the confirm and cancel handlers", async () => {
    const user = userEvent.setup();
    const { props } = renderConfirmDialog();

    await user.click(screen.getByRole("button", { name: /confirm/i }));

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(props.onConfirm).toHaveBeenCalledTimes(1);
    expect(props.onCancel).toHaveBeenCalledTimes(1);
  });

  it("cancels with Escape and a backdrop click", () => {
    const { props } = renderConfirmDialog();
    const dialog = screen.getByRole("dialog");
    const backdrop = dialog.parentElement;

    expect(backdrop).not.toBeNull();

    fireEvent.keyDown(document, {
      key: "Escape",
    });

    fireEvent.click(backdrop!);

    expect(props.onCancel).toHaveBeenCalledTimes(2);
  });

  it("does not cancel when the dialog content is clicked", () => {
    const { props } = renderConfirmDialog();

    fireEvent.click(screen.getByRole("dialog"));

    expect(props.onCancel).not.toHaveBeenCalled();
  });

  it("moves focus into the dialog and traps keyboard focus", () => {
    renderConfirmDialog();

    const cancelButton = screen.getByRole("button", {
      name: /cancel/i,
    });
    const confirmButton = screen.getByRole("button", {
      name: /confirm/i,
    });

    expect(cancelButton).toHaveFocus();

    fireEvent.keyDown(document, {
      key: "Tab",
      shiftKey: true,
    });

    expect(confirmButton).toHaveFocus();

    fireEvent.keyDown(document, {
      key: "Tab",
    });

    expect(cancelButton).toHaveFocus();
  });

  it("restores focus after closing", () => {
    const props: React.ComponentProps<typeof ConfirmDialog> = {
      open: false,
      title: "Delete playlist?",
      description: "This action cannot be undone.",
      onConfirm: jest.fn(),
      onCancel: jest.fn(),
    };

    const { rerender } = render(
      <>
        <button type="button">Open dialog</button>
        <ConfirmDialog {...props} />
      </>,
    );

    const trigger = screen.getByRole("button", {
      name: /open dialog/i,
    });

    trigger.focus();
    expect(trigger).toHaveFocus();

    rerender(
      <>
        <button type="button">Open dialog</button>
        <ConfirmDialog {...props} open />
      </>,
    );

    expect(screen.getByRole("button", { name: /cancel/i })).toHaveFocus();

    rerender(
      <>
        <button type="button">Open dialog</button>
        <ConfirmDialog {...props} />
      </>,
    );

    expect(trigger).toHaveFocus();
  });

  it("prevents cancellation and disables actions while loading", () => {
    const { props } = renderConfirmDialog({
      loading: true,
      confirmLabel: "Delete",
    });

    const dialog = screen.getByRole("dialog");
    const backdrop = dialog.parentElement;

    expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled();

    expect(
      screen.getByRole("button", { name: /delete\.\.\./i }),
    ).toBeDisabled();

    fireEvent.keyDown(document, {
      key: "Escape",
    });

    fireEvent.click(backdrop!);

    expect(props.onCancel).not.toHaveBeenCalled();
  });
});
