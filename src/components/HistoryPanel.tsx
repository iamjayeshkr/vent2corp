"use client";

import { useState } from "react";
import { Copy, Trash2, RotateCcw, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { HistoryItem } from "@/types";

interface HistoryPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  history: HistoryItem[];
  onDelete: (id: string) => void;
  onReopen: (item: HistoryItem) => void;
  onClear: () => void;
}

export function HistoryPanel({
  open,
  onOpenChange,
  history,
  onDelete,
  onReopen,
  onClear,
}: HistoryPanelProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col h-full min-h-0 p-6 overflow-hidden">
        <SheetHeader className="p-0 pb-2 border-b border-border/60">
          <SheetTitle className="flex items-center gap-2 text-base font-bold font-mono">
            <Clock className="w-4 h-4 text-emerald-400" />
            Translation History
          </SheetTitle>
        </SheetHeader>

        {history.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <Clock className="w-10 h-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">
              No translations recorded yet.
              <br />
              Start translating to build your history log.
            </p>
          </div>
        ) : (
          <div className="flex flex-col flex-1 min-h-0 pt-2">
            <div className="flex items-center justify-between py-2 mb-2">
              <p className="text-xs font-mono text-muted-foreground">
                {history.length} {history.length === 1 ? "entry" : "entries"}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="text-destructive hover:text-destructive gap-1.5 h-7 text-xs font-mono"
              >
                <Trash2 className="w-3 h-3" />
                Clear all
              </Button>
            </div>

            {/* Scrollable Container */}
            <div className="flex-1 overflow-y-auto min-h-0 pr-1 space-y-4 font-sans">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3 hover:border-foreground/20 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      {formatTime(item.timestamp)}
                    </p>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg"
                        onClick={() =>
                          handleCopy(
                            item.translated,
                            `${item.id}-copy`
                          )
                        }
                      >
                        {copiedId === `${item.id}-copy` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg"
                        onClick={() => onReopen(item)}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive"
                        onClick={() => onDelete(item.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] font-mono text-amber-500 uppercase tracking-wider">Original</p>
                    <p className="text-sm font-medium leading-snug">{item.original}</p>
                  </div>

                  <Separator />

                  <div className="space-y-1">
                    <p className="text-[11px] font-mono text-emerald-500 uppercase tracking-wider">
                      Corporate Output
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.translated}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <Badge variant="secondary" className="text-xs font-mono font-normal">
                      {item.tone}
                    </Badge>
                    <Badge variant="secondary" className="text-xs font-mono font-normal">
                      {item.recipient}
                    </Badge>
                    <Badge variant="secondary" className="text-xs font-mono font-normal">
                      {item.platform}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
