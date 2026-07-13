import type { ComponentType, SVGProps } from "react";

type StatCardProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  value: string | number;
};

export default function StatCard({
  icon,
  label,
  value,
}: StatCardProps) {
  const Icon = icon;

  return (
    <section
      aria-label={label}
      className="
        rounded-xl
        border border-zinc-700
        bg-zinc-900
        p-6
        text-center
        shadow-sm
      "
    >
      <Icon
        className="mx-auto mb-3 h-12 w-12 text-zinc-200"
        aria-hidden="true"
      />

      <p className="text-sm text-gray-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold text-white">
        {value}
      </p>
    </section>
  );
}