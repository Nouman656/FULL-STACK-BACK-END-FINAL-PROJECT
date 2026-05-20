const MIN_YEAR = 1970;
const MAX_YEAR = 9999;

export const MONTH_OPTIONS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export function getCurrentMonthYear() {
  const now = new Date();
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  };
}

function normalizeRawParam(value) {
  if (Array.isArray(value)) {
    return value[0];
  }

  if (typeof value !== "string") {
    return undefined;
  }

  return value.trim();
}

function parseValidInteger(value) {
  if (!value) return null;
  if (!/^\d+$/.test(value)) return null;

  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function readParam(searchParams, key) {
  if (!searchParams) return undefined;

  if (typeof searchParams.get === "function") {
    return normalizeRawParam(searchParams.get(key));
  }

  return normalizeRawParam(searchParams[key]);
}

export function parseMonthYear(searchParams) {
  const current = getCurrentMonthYear();
  const monthValue = parseValidInteger(readParam(searchParams, "month"));
  const yearValue = parseValidInteger(readParam(searchParams, "year"));

  const month =
    monthValue !== null && monthValue >= 1 && monthValue <= 12
      ? monthValue
      : current.month;
  const year =
    yearValue !== null && yearValue >= MIN_YEAR && yearValue <= MAX_YEAR
      ? yearValue
      : current.year;

  return { month, year };
}

export function getMonthDateRange({ month, year }) {
  const safeMonth = Number(month);
  const safeYear = Number(year);

  const start = new Date(safeYear, safeMonth - 1, 1);
  const end = new Date(safeYear, safeMonth, 1);

  return { start, end };
}

export function toMonthYearQuery({ month, year }) {
  return {
    month: String(month),
    year: String(year),
  };
}
