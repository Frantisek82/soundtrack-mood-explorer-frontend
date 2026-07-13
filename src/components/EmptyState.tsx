import {
  forwardRef,
  type ComponentType,
  type SVGProps,
} from "react";
import Link from "next/link";

import Button from "./Button";

type EmptyStateProps = {
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  buttonText?: string;
  buttonHref?: string;
};

const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      icon: Icon,
      title,
      description,
      buttonText,
      buttonHref,
    },
    ref,
  ) => (
    <div
      ref={ref}
      tabIndex={-1}
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center text-center py-16 px-4 outline-none"
    >
      {Icon && (
        <Icon
          className="mb-4 h-16 w-16 text-zinc-300"
          aria-hidden="true"
        />
      )}

      <h2 className="text-2xl font-semibold text-white mb-2">
        {title}
      </h2>

      <p className="max-w-md text-gray-400 mb-6">
        {description}
      </p>

      {buttonText && buttonHref && (
        <Link href={buttonHref}>
          <Button>{buttonText}</Button>
        </Link>
      )}
    </div>
  ),
);

EmptyState.displayName = "EmptyState";

export default EmptyState;