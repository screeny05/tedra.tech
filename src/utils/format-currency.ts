export function formatCurrency(value: number) {
  const formatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  });
  return formatter.format(value / 100);
}
