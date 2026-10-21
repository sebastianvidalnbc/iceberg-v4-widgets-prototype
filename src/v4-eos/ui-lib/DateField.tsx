import { useState } from "react";
import { Popover } from "radix-ui";
import { Icon } from "./Icon";
import { Button } from "./Button";
import { dayKey, formatDay } from "../schedule";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Calendar-day picker for a table cell. Days outside [earliest, latest] are
// disabled, so a caller can keep one date strictly before another.
export function DateField({
  label,
  value,
  onChange,
  earliest = null,
  latest = null,
  placeholder,
  hint,
}: {
  label: string;
  value: Date | null;
  onChange: (next: Date | null) => void;
  earliest?: Date | null;
  latest?: Date | null;
  placeholder: string;
  hint?: string;
}) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<Date>(() => startOfMonth(value ?? latest ?? earliest ?? new Date()));

  const handleOpenChange = (next: boolean) => {
    if (next) setView(startOfMonth(value ?? latest ?? earliest ?? new Date()));
    setOpen(next);
  };

  const year = view.getFullYear();
  const month = view.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: view.getDay() }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const isDisabled = (d: Date) => {
    const k = dayKey(d);
    if (earliest && k < dayKey(earliest)) return true;
    if (latest && k > dayKey(latest)) return true;
    return false;
  };

  const pick = (d: Date | null) => {
    onChange(d);
    setOpen(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={handleOpenChange}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={`ui-date-field__trigger${value ? "" : " is-empty"}`}
          aria-label={`${label}: ${value ? formatDay(value) : placeholder}`}
        >
          <Icon name="calendar" size={14} />
          <span>{value ? formatDay(value) : placeholder}</span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="ui-date-field__panel" align="start" sideOffset={6} collisionPadding={8}>
          <div className="ui-date-field__head">
            <button
              type="button"
              className="ui-date-field__nav"
              aria-label="Previous month"
              onClick={() => setView(new Date(year, month - 1, 1))}
            >
              <Icon name="chevron-left" size={14} />
            </button>
            <span className="ui-date-field__month">
              {MONTHS[month]} {year}
            </span>
            <button
              type="button"
              className="ui-date-field__nav"
              aria-label="Next month"
              onClick={() => setView(new Date(year, month + 1, 1))}
            >
              <Icon name="chevron-right" size={14} />
            </button>
          </div>
          <div className="ui-date-field__grid" role="grid" aria-label={label}>
            {WEEKDAYS.map((w) => (
              <span key={w} className="ui-date-field__weekday" aria-hidden="true">
                {w}
              </span>
            ))}
            {cells.map((d, i) =>
              d ? (
                <button
                  key={i}
                  type="button"
                  className={`ui-date-field__day${value && dayKey(value) === dayKey(d) ? " is-selected" : ""}`}
                  disabled={isDisabled(d)}
                  aria-pressed={!!value && dayKey(value) === dayKey(d)}
                  aria-label={formatDay(d)}
                  onClick={() => pick(d)}
                >
                  {d.getDate()}
                </button>
              ) : (
                <span key={i} />
              )
            )}
          </div>
          {hint && <p className="ui-date-field__hint">{hint}</p>}
          <div className="ui-date-field__foot">
            <Button variant="tertiary" size="sm" disabled={!value} onClick={() => pick(null)}>
              Clear
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
