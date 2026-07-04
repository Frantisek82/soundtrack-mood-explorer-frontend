type StatCardProps = {
  icon: string;
  label: string;
  value: string | number;
};

export default function StatCard({
  icon,
  label,
  value,
}: StatCardProps) {
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
      <div
        className="text-4xl mb-3"
        aria-hidden="true"
      >
        {icon}
      </div>

      <p className="text-sm text-gray-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold text-white">
        {value}
      </p>
    </section>
  );
}