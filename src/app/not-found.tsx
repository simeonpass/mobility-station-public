import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-site py-20 text-center">
      <h1 className="text-4xl font-extrabold">Page not found</h1>
      <p className="mt-3 text-muted">
        The page you requested is unavailable. Try the shop or book a demo instead.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonVariants()}>
          Go home
        </Link>
        <Link href="/shop" className={buttonVariants({ variant: "outline" })}>
          Scooters &amp; wheelchairs
        </Link>
      </div>
    </div>
  );
}
