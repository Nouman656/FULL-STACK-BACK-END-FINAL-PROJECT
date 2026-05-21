import { getCurrentMonthYear } from "../monthPlan";

export const SEARCH_MODE_ERROR = "Search mode is view-only.";

export function rejectSearchMode(formData) {
  const mode = formData.get("mode");
  if (mode === "search") {
    return { error: SEARCH_MODE_ERROR };
  }
  return null;
}

export function parseFormMonthYear(formData) {
  const monthRaw = formData.get("month");
  const yearRaw = formData.get("year");
  const month = Number(monthRaw);
  const year = Number(yearRaw);

  if (
    monthRaw !== null &&
    monthRaw !== "" &&
    yearRaw !== null &&
    yearRaw !== "" &&
    !Number.isNaN(month) &&
    !Number.isNaN(year) &&
    month >= 1 &&
    month <= 12 &&
    year >= 1970
  ) {
    return { month, year };
  }

  return getCurrentMonthYear();
}
