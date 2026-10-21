import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import {
  GROUP_SWATCHES,
  groupHueVars,
  type GroupSwatch,
  type GroupSwatchId,
} from "../browse";

const HUE_STORAGE = "iceberg-v4-group-hues";

export function useGroupHues() {
  const [overrides, setOverrides] = useState<Record<string, GroupSwatchId>>(() => {
    try {
      const raw = localStorage.getItem(HUE_STORAGE);
      return raw ? (JSON.parse(raw) as Record<string, GroupSwatchId>) : {};
    } catch {
      return {};
    }
  });

  const setGroupHue = (groupId: string, id: GroupSwatchId) => {
    setOverrides((prev) => {
      const next = { ...prev, [groupId]: id };
      try {
        localStorage.setItem(HUE_STORAGE, JSON.stringify(next));
      } catch {
        /* prototype: ignore quota / private-mode */
      }
      return next;
    });
  };

  const swatchFor = (groupId: string, fallback: GroupSwatchId): GroupSwatch =>
    GROUP_SWATCHES.find((s) => s.id === (overrides[groupId] ?? fallback)) ?? GROUP_SWATCHES[0];

  return { swatchFor, setGroupHue };
}

export function BrowseGroupHeader({
  name,
  count,
  collapsed,
  swatch,
  onToggle,
  onOpen,
  onSwatchChange,
}: {
  name: string;
  count: number;
  collapsed: boolean;
  swatch: GroupSwatch;
  onToggle: () => void;
  // Optional: the top-level slug itself is a page, so its name opens it.
  onOpen?: () => void;
  onSwatchChange: (id: GroupSwatchId) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="ui-ws-browse__group"
      role="row"
      style={groupHueVars(swatch)}
    >
      <button
        type="button"
        className={`ui-ws-browse__group-toggle${onOpen ? " ui-ws-browse__group-toggle--icon" : ""}`}
        aria-expanded={!collapsed}
        aria-label={`${collapsed ? "Expand" : "Collapse"} ${name}`}
        onClick={onToggle}
      >
        <Icon
          name={collapsed ? "chevron-right" : "chevron-down"}
          className="ui-ws-browse__group-chevron"
        />
      </button>
      {onOpen ? (
        <button type="button" className="ui-ws-browse__group-name ui-ws-browse__group-open" onClick={onOpen}>
          {name}
        </button>
      ) : (
        <span className="ui-ws-browse__group-name">{name}</span>
      )}
      <div className="ui-ws-browse__group-color">
        <button
          type="button"
          className="ui-ws-browse__group-swatch"
          aria-label={`Group color, ${swatch.label}`}
          aria-haspopup="listbox"
          aria-expanded={open}
          title="Choose group color"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="ui-ws-browse__group-swatch-chip" aria-hidden="true" />
        </button>
        {open && (
          <div className="ui-ws-browse__hue-menu" role="listbox" aria-label="Group color">
            {GROUP_SWATCHES.map((s) => (
              <button
                key={s.id}
                type="button"
                role="option"
                aria-selected={s.id === swatch.id}
                aria-label={s.label}
                title={s.label}
                className={`ui-ws-browse__hue-opt${s.id === swatch.id ? " is-selected" : ""}`}
                style={{ background: s.fam }}
                onClick={() => {
                  onSwatchChange(s.id);
                  setOpen(false);
                }}
              />
            ))}
          </div>
        )}
      </div>
      <span className="ui-ws-browse__group-count">{count}</span>
    </div>
  );
}
