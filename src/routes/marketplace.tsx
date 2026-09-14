import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Loader2, MapPin, Sprout } from "lucide-react";
import { useEffect, useState } from "react";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { fetchAvailableListings, formatDate, type CropListing } from "@/lib/listings";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Crop Marketplace — CropConnect" },
      {
        name: "description",
        content:
          "Browse fresh crop listings posted directly by farmers — quantity, price per kg, location and harvest date.",
      },
      { property: "og:title", content: "Crop Marketplace — CropConnect" },
      {
        property: "og:description",
        content: "Live crop listings posted directly by farmers on CropConnect.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MarketplacePage,
});

function MarketplacePage() {
  const [listings, setListings] = useState<CropListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchAvailableListings()
      .then((rows) => active && setListings(rows))
      .catch((e: Error) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="hero-wash">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <h1 className="text-3xl font-semibold sm:text-4xl lg:text-5xl">Crop Marketplace</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Every harvest currently listed by farmers on CropConnect.
          </p>

          {loading && (
            <div className="mt-12 flex items-center gap-3 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading listings…
            </div>
          )}

          {error && (
            <p className="mt-12 rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">
              Couldn't load listings: {error}
            </p>
          )}

          {!loading && !error && listings.length === 0 && (
            <div className="mt-12 rounded-[1.75rem] border border-dashed border-border bg-card/60 p-10 text-center">
              <Sprout className="mx-auto h-8 w-8 text-primary" />
              <p className="mt-4 text-muted-foreground">No crops listed yet.</p>
              <Button asChild className="mt-6 rounded-full px-6">
                <Link to="/farmer">List your crop</Link>
              </Button>
            </div>
          )}

          {listings.length > 0 && (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((l, i) => (
                <article
                  key={l.id}
                  className="card-soft animate-rise flex min-w-0 flex-col p-6"
                  style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="min-w-0 truncate text-xl font-semibold">{l.crop}</h2>
                    <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium capitalize text-primary">
                      {l.status}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm text-muted-foreground">{l.farmer_name}</p>

                  <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
                    <div className="min-w-0">
                      <dt className="text-xs text-muted-foreground">Quantity</dt>
                      <dd className="mt-1 font-medium">{l.quantity_kg} kg</dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="text-xs text-muted-foreground">Price</dt>
                      <dd className="mt-1 font-medium text-primary">₹{l.price_per_kg}/kg</dd>
                    </div>
                  </dl>

                  <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{l.location}</span>
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">Harvested {formatDate(l.harvest_date)}</span>
                  </p>

                  {l.description && (
                    <p className="mt-5 line-clamp-3 rounded-xl bg-muted p-4 text-sm text-muted-foreground">
                      {l.description}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
