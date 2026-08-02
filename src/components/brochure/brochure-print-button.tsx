"use client";

import { Printer } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function BrochurePrintButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={cn(
        buttonVariants({ size: "lg" }),
        "rounded-full no-print",
        className,
      )}
    >
      <Printer className="h-4 w-4" aria-hidden />
      Download / print PDF
    </button>
  );
}
