"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  MONTH_OPTIONS,
  parseDashboardMode,
  toMonthYearQuery,
} from "../lib/dateFilters";

export default function MonthYearFilter({ month, year, mode = "edit" }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateFilter(nextMonth, nextYear) {
    const params = new URLSearchParams(searchParams.toString());
    const query = toMonthYearQuery({ month: nextMonth, year: nextYear });
    const activeMode = parseDashboardMode(
      Object.fromEntries(params.entries())
    );

    params.set("month", query.month);
    params.set("year", query.year);
    params.set("mode", activeMode || mode);

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="form-wrapper">
      <h2 className="h3">Filter by period</h2>
      <div className="grid-sm">
        <div className="grid-xs">
          <label htmlFor="monthFilter">Month</label>
          <select
            id="monthFilter"
            value={String(month)}
            onChange={(event) => updateFilter(event.target.value, year)}
          >
            {MONTH_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid-xs">
          <label htmlFor="yearFilter">Year</label>
          <input
            id="yearFilter"
            type="number"
            min="1970"
            max="9999"
            inputMode="numeric"
            value={String(year)}
            onChange={(event) => updateFilter(month, event.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
