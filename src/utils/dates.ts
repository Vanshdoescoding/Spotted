const formatter = new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
});

export function formatObservedAt(value: string): string {
  return formatter.format(new Date(value));
}

