import Image from "next/image";
import { cn } from "@/lib/utils";

export type CollageTile = {
  src: string;
  alt: string;
  /** Optional object-position utility, e.g. object-center */
  object?: string;
};

type ImageCollageProps = {
  tiles: CollageTile[];
  /** Fixed height for desktop collage */
  className?: string;
  /** White product-style tiles vs photo cover */
  contain?: boolean;
  priority?: boolean;
};

/**
 * Five-tile jigsaw that fills the frame without gaps or skew:
 *   a a b
 *   a a c
 *   d e e
 *
 * Uses next/image only here (homepage LCP). Custom loader in next.config
 * serves local files directly — no Vercel Image Optimization.
 */
export function ImageCollage({
  tiles,
  className,
  contain = false,
  priority = false,
}: ImageCollageProps) {
  const [a, b, c, d, e] = tiles;
  if (!a) return null;

  const areas = [
    { tile: a, area: "a" },
    { tile: b ?? a, area: "b" },
    { tile: c ?? a, area: "c" },
    { tile: d ?? a, area: "d" },
    { tile: e ?? a, area: "e" },
  ];

  return (
    <>
      {/* Desktop / tablet — locked jigsaw */}
      <div
        className={cn(
          "relative hidden h-[28rem] overflow-hidden sm:block md:h-[34rem] lg:h-[36rem]",
          className,
        )}
      >
        <div
          className="relative z-10 grid h-full min-w-0 gap-2.5 md:gap-3"
          style={{
            gridTemplateColumns: "1.35fr 1fr 1fr",
            gridTemplateRows: "1fr 1fr 1.05fr",
            gridTemplateAreas: `
              "a a b"
              "a a c"
              "d e e"
            `,
          }}
        >
          {areas.map(({ tile, area }, i) => (
            <div
              key={`${area}-${tile.src}`}
              className="collage-tile relative min-h-0 overflow-hidden rounded-2xl border border-border/60 bg-white shadow-[0_8px_24px_rgb(0_0_0_/_0.07)]"
              style={{
                gridArea: area,
                animationDelay: `${80 + i * 70}ms`,
              }}
            >
              <Image
                src={tile.src}
                alt={tile.alt}
                fill
                sizes="(max-width: 1024px) 40vw, 26vw"
                className={cn(
                  contain ? "object-contain p-3 md:p-4" : "object-cover",
                  tile.object ?? "object-center",
                )}
                priority={priority && i === 0}
                loading={priority && i === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile — compact 2×2 */}
      <div className="grid grid-cols-2 gap-2.5 sm:hidden">
        {areas.slice(0, 4).map(({ tile, area }, i) => (
          <div
            key={`m-${area}-${tile.src}`}
            className="relative aspect-square overflow-hidden rounded-2xl border border-border/60 bg-white"
          >
            <Image
              src={tile.src}
              alt={tile.alt}
              fill
              sizes="50vw"
              className={cn(
                contain ? "object-contain p-2.5" : "object-cover",
                tile.object ?? "object-center",
              )}
              priority={priority && i === 0}
              loading={priority && i === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>
    </>
  );
}
