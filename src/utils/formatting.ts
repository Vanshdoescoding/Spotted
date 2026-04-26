export function formatCount(value: number, singular: string, plural = `${singular}s`): string {
  return `${value} ${value === 1 ? singular : plural}`;
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

