import Link from "next/link";
import { forwardRef } from "react";

type EmptyStateProps = {
  icon?: string;
  title: string;
  description: string;
  buttonText?: string;
  buttonHref?: string;
};

const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      icon = "📭",
      title,
      description,
      buttonText,
      buttonHref,
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center text-center py-16 px-4 outline-none"
      >
        <div className="text-5xl mb-4">{icon}</div>

        <h2 className="text-2xl font-semibold text-white mb-2">
          {title}
        </h2>

        <p className="max-w-md text-gray-400 mb-6">
          {description}
        </p>

        {buttonText && buttonHref && (
          <Link
            href={buttonHref}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-white font-medium hover:bg-indigo-500 transition"
          >
            {buttonText}
          </Link>
        )}
      </div>
    );
  },
);

EmptyState.displayName = "EmptyState";

export default EmptyState;