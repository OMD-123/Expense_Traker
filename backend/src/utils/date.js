export function monthKey(dateInput = new Date()) {
  const date = new Date(dateInput);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${year}-${month}`;
}

export function monthRange(month) {
  const [year, rawMonth] = month.split("-").map(Number);
  const start = new Date(year, rawMonth - 1, 1);
  const end = new Date(year, rawMonth, 1);
  return { start, end };
}
