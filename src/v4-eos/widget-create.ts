import { PRODUCTION_WIDGETS, type ProductionWidget } from "./production-widgets";
import {
  WIDGET_CONFIGS,
  type PreviewData,
  type StructureNode,
  type TreeNode,
} from "./data";
import { buildLayoutNode, getLayoutDef } from "./layouts";

// Widget registry shared by the Widgets list, the editor collection and the
// editor itself. Every production widget gets an editable config (empty
// Structure until sections are added from the Layout Picker). Widgets created
// in this session ("+" on the Widgets list) are prepended to the list.

const CREATED: ProductionWidget[] = [];
let createdSeq = 0;

export function productionWidgetId(slug: string): string {
  return `wg-prod-${slug.replace(/^\//, "")}`;
}

export function allWidgets(): ProductionWidget[] {
  return [...CREATED, ...PRODUCTION_WIDGETS];
}

function emptyWidgetPreview(slug: string): PreviewData {
  return {
    title: "Empty widget",
    subtitle: slug,
    tone: "neutral",
    body: "No sections yet. Start from a layout to build this widget.",
  };
}

function registerConfig(id: string, slug: string, structure: StructureNode[] = []): void {
  WIDGET_CONFIGS[id] = {
    id,
    name: slug,
    structure,
    previewData: emptyWidgetPreview(slug),
    defaultSelectionId: structure[0]?.id ?? "",
  };
}

for (const w of PRODUCTION_WIDGETS) registerConfig(productionWidgetId(w.slug), w.slug);

// Flat collection for the editor's left pane (Pages-style: one row per widget).
export function widgetCollectionTree(): TreeNode[] {
  return allWidgets().map((w) => ({
    id: productionWidgetId(w.slug),
    label: w.slug,
    type: "page",
    kind: "path",
    children: [],
  }));
}

function listDate(ts: number): string {
  const d = new Date(ts);
  const wd = d.toLocaleDateString("en-GB", { weekday: "short", timeZone: "UTC" });
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mon = d.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" });
  const yy = String(d.getUTCFullYear()).slice(2);
  return `${wd} ${dd} ${mon} ${yy}`;
}

// "+" on the Widgets list: a new widget starts from a layout. Returns the new
// widget id (the editor route) or null if the layout is unknown.
export function createWidgetFromLayout(layoutId: string): string | null {
  const def = getLayoutDef(layoutId);
  if (!def) return null;
  createdSeq += 1;
  const slug = `/new-widget-${createdSeq}`;
  const now = Date.now();
  // Production format for a layout-built widget is not confirmed; HTML is the
  // default shown here.
  CREATED.unshift({
    slug,
    format: "HTML",
    status: "Draft",
    created: listDate(now),
    modified: "just now",
    createdAt: now,
    modifiedAt: now,
  });
  const id = productionWidgetId(slug);
  registerConfig(id, slug, [buildLayoutNode(def)]);
  return id;
}
