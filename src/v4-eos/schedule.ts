// Calendar-day helpers for a variant's scheduled release and un-publish date.
// Dates are whole days in local time; the table shows them as "May 10 26".

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function dayKey(d: Date): number {
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

export function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

export function sameDay(a: Date | null, b: Date | null): boolean {
  return !!a && !!b && dayKey(a) === dayKey(b);
}

export function formatDay(d: Date): string {
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()} ${String(d.getFullYear()).slice(-2)}`;
}

// Parses the sample "MMM D 26" strings used by the browse data.
export function parseSampleDay(s: string): Date {
  const [m, day] = s.split(" ");
  return new Date(2026, MONTHS_SHORT.indexOf(m), Number(day));
}
