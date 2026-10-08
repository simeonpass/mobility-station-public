import Image from "next/image";

/** The same angled, full-height photography used on the approved homepage. */
export function EditorialImage({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <div className="ms-editorial-image">
      <Image src={src} alt={alt} width={1200} height={800} loading="eager" fetchPriority="high" unoptimized />
      {caption ? <p>{caption}</p> : null}
    </div>
  );
}
