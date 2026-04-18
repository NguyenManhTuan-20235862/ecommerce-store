export function formatCurrency(value, locale = "vi-VN", currency = "VND") {
  const amount = Number.isFinite(Number(value)) ? Number(value) : 0;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
