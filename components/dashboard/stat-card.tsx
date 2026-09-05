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
    <div className="rounded-2xl border border-[#e5ddd0] bg-white p-5 sm:p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#b8924a]/60 hover:shadow-md motion-reduce:hover:translate-y-0">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#7a7268]">
            {title}
          </p>

          <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-[#1e1b17]">
            {value}
          </h2>

          {description && (
            <p className="mt-1 text-xs text-[#7a7268]">{description}</p>
          )}
        </div>

        <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border border-[#e8e4de] bg-[#faf7f2] text-[#b8924a] shadow-xs">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
