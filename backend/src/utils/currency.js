const indianCurrencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
});

export function formatCurrency(value) {
  return indianCurrencyFormatter.format(Number(value) || 0);
}
