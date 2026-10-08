"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

function typedNameToDataUrl(name: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 220;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#111111";
  ctx.font = "italic 52px Georgia, 'Times New Roman', serif";
  ctx.textBaseline = "middle";
  ctx.fillText(name.trim(), 40, 110, 720);
  return canvas.toDataURL("image/png");
}

export function SignaturePad({
  onChange,
  typedName = "",
  onTypedNameChange,
}: {
  onChange: (dataUrl: string | null) => void;
  typedName?: string;
  onTypedNameChange?: (name: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const [empty, setEmpty] = useState(true);
  const [mode, setMode] = useState<"draw" | "type">("draw");
  const [localName, setLocalName] = useState(typedName);

  useEffect(() => {
    setLocalName(typedName);
  }, [typedName]);

  useEffect(() => {
    if (mode !== "draw") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#111111";
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [mode]);

  useEffect(() => {
    if (mode !== "type") return;
    const name = localName.trim();
    if (name.length < 2) {
      onChange(null);
      return;
    }
    onChangeRef.current(typedNameToDataUrl(name));
  }, [mode, localName]);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    drawing.current = true;
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    canvasRef.current?.setPointerCapture(e.pointerId);
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const p = pos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    setEmpty(false);
  };

  const end = () => {
    drawing.current = false;
    if (!empty && canvasRef.current) {
      onChange(canvasRef.current.toDataURL("image/png"));
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setEmpty(true);
    setLocalName("");
    onTypedNameChange?.("");
    onChange(null);
  };

  function setName(value: string) {
    setLocalName(value);
    onTypedNameChange?.(value);
  }

  return (
    <div>
      <div
        className="mb-3 inline-flex rounded-full border border-border bg-white p-1"
        role="tablist"
        aria-label="Signature method"
      >
        {(
          [
            ["draw", "Draw signature"],
            ["type", "Type name"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={mode === id}
            onClick={() => {
              setMode(id);
              onChange(null);
              setEmpty(true);
            }}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              mode === id
                ? "bg-primary text-primary-foreground"
                : "text-primary hover:bg-soft"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "draw" ? (
        <div>
          <p id="signature-hint" className="mb-2 text-sm text-muted">
            Draw your signature in the box, or switch to type your name if
            drawing is difficult.
          </p>
          <div className="overflow-hidden rounded-xl border border-border bg-white">
            <canvas
              ref={canvasRef}
              className="h-40 w-full touch-none"
              role="img"
              aria-labelledby="signature-hint"
              onPointerDown={start}
              onPointerMove={move}
              onPointerUp={end}
              onPointerLeave={end}
            />
          </div>
        </div>
      ) : (
        <div>
          <Label htmlFor="typed-signature">Type your full name</Label>
          <Input
            id="typed-signature"
            autoComplete="name"
            value={localName}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name as your signature"
          />
          <p className="mt-2 text-sm text-muted">
            We’ll save this typed name as your signature on the hire agreement.
          </p>
        </div>
      )}

      <div className="mt-2 flex justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={clear}>
          Clear signature
        </Button>
      </div>
    </div>
  );
}
