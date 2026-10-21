// Production variants for widgets (the "Variants for /slug" list). Only widgets
// whose variants were captured are listed; everything else has none yet.

export interface WidgetVariant {
  id: string;
  name: string;
  qaStatus: "Approved" | "In review" | "—";
  published: boolean;
  /** Scheduled release day, or null when not scheduled. */
  scheduledAt: Date | null;
  createdDate: string;
  modifiedDate: string;
  modifiedBy: string;
}

// Captured from production "Variants for /basket-upsell-config".
export const WIDGET_VARIANTS: Record<string, WidgetVariant[]> = {
  "/basket-upsell-config": [
    {
      id: "wv-basket-tanya-test",
      name: "Tanya Test",
      qaStatus: "—",
      published: false,
      scheduledAt: null,
      createdDate: "Tue 20 Oct 26",
      modifiedDate: "Wed 21 Oct 26",
      modifiedBy: "Reeves, Tanya",
    },
    {
      id: "wv-basket-copy-of-variant-1",
      name: "Copy of variant 1",
      qaStatus: "—",
      published: true,
      scheduledAt: null,
      createdDate: "Mon 20 Jul 26",
      modifiedDate: "Mon 20 Jul 26",
      modifiedBy: "Maher, Jamie",
    },
    {
      id: "wv-basket-variant-1",
      name: "variant 1",
      qaStatus: "—",
      published: false,
      scheduledAt: null,
      createdDate: "Tue 19 May 26",
      modifiedDate: "Tue 19 May 26",
      modifiedBy: "Maher, Jamie",
    },
  ],
};

export function widgetVariantsFor(slug: string): WidgetVariant[] {
  return WIDGET_VARIANTS[slug] ?? [];
}
