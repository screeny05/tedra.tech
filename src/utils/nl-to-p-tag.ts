export function nlToPTag(value: string) {
  return value.split('\n').map((line) => `<p>${line}</p>`);
}
