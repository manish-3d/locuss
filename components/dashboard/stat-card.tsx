import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  color?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-[#e5ddd0] bg-white p-3 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#b8924a]/60 hover:shadow-md motion-reduce:hover:translate-y-0 sm:rounded-2xl sm:p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#7a7268]">
            {title}
          </p>

          <h2 className="mt-1 font-serif text-xl font-bold text-[#1e1b17] sm:mt-2 sm:text-3xl">
            {value}
          </h2>

          {description && (
            <p className="mt-1 text-xs text-[#7a7268]">{description}</p>
          )}
        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e8e4de] bg-[#faf7f2] text-[#b8924a] shadow-xs sm:h-11 sm:w-11 sm:rounded-xl">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      </div>
    </div>
  );
}
