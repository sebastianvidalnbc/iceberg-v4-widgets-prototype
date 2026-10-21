import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/v4-eos/ui/dialog";
import { Button } from "@/v4-eos/ui/button";
import { MSym } from "@/v4-eos/ui/msym";
import type { TerritoryCheck } from "../publish-check";

// Confirm before a variant goes live: lists each territory's title and URL.
// Publish is confirmed here; Cancel leaves the variant unpublished.
export function PublishCheckDialog({
  open,
  onOpenChange,
  checks,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checks: TerritoryCheck[];
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Confirm publish</DialogTitle>
          <DialogDescription>
            A title is required for the page to be published in the given territory. The URL will use the
            Primary URL (PURL) if one has been defined for that territory, otherwise it will default to the
            page SLUG.
          </DialogDescription>
        </DialogHeader>

        <div className="px-5 py-4">
          <table className="w-full border-collapse overflow-hidden rounded-md border border-border text-[length:var(--type-body-sm-size)] leading-[length:var(--type-body-sm-lh)]">
            <thead className="bg-[var(--color-bg-subtle)] text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Territory</th>
                <th className="whitespace-nowrap px-3 py-2 text-center font-medium">Has Title</th>
                <th className="px-3 py-2 text-left font-medium">URL</th>
                <th className="whitespace-nowrap px-3 py-2 text-left font-medium">URL Origin</th>
              </tr>
            </thead>
            <tbody>
              {checks.map((c) => (
                <tr key={c.territory} className="border-t border-border">
                  <td className="whitespace-nowrap px-3 py-2 text-foreground">{c.territory}</td>
                  <td className="px-3 py-2 text-center">
                    {c.hasTitle ? (
                      <MSym
                        name="check_circle"
                        size={18}
                        filled
                        className="text-[color:var(--color-status-success)]"
                      />
                    ) : (
                      <MSym
                        name="cancel"
                        size={18}
                        filled
                        className="text-[color:var(--color-status-danger)]"
                      />
                    )}
                  </td>
                  <td className="px-3 py-2 font-mono text-foreground">{c.url ?? ""}</td>
                  <td className="px-3 py-2 text-muted-foreground">{c.origin ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Publish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
