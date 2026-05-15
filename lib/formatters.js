export function formatDateToLocaleString(date) {
  const value = date instanceof Date ? date : new Date(date);
  return value.toLocaleDateString();
}

export function formatPercentage(amt) {
  return amt.toLocaleString(undefined, {
    style: "percent",
    minimumFractionDigits: 0,
  });
}

export function formatCurrency(amt) {
  return amt.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
  });
}
