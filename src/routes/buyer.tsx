import { createFileRoute } from "@tanstack/react-router";
import { Loader2, MapPin, Search, Sparkles } from "lucide-react";
import { useState } from "react";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, scoreListings, searchListings, type ScoredListing } from "@/lib/listings";

export const Route = createFileRoute("/buyer")({
  head: () => ({
    meta: [
      { title: "Find the Right Produce — CropConnect" },
      {
        name: "description",
        content:
          "Tell CropConnect what produce you need and get farmer listings ranked by price and available quantity.",
      },
      { property: "og:title", content: "Find the Right Produce — CropConnect" },
      {
        property: "og:description",
        content: "Source directly from farmers with ranked crop listings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BuyerPage,
});

function BuyerPage() {
  const [form, setForm] = useState({ crop: "", qty: "", price: "", location: "" });
  const [natural, setNatural] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<ScoredListing[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiNote, setAiNote] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function parseWithAI() {
    if (!natural.trim()) {
      setAiError("Please describe what you need first.");
      return;
    }
    setAiLoading(true);
    setAiError(null);
    setAiNote(null);
    try {
      const response = await fetch("/api/parse-buyer-input", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: natural }),
      });
      const data = (await response.json()) as {
        crop?: string;
        quantity_kg?: number | null;
        max_price_per_kg?: number | null;
        location?: string;
        error?: string;
      };
      if (!response.ok) {
        setAiError(data.error ?? "AI could not understand your request.");
        return;
      }
      setForm((f) => ({
        crop: data.crop || f.crop,
        qty: data.quantity_kg != null ? String(data.quantity_kg) : f.qty,
        price:
          data.max_price_per_kg != null ? String(data.max_price_per_kg) : f.price,
        location: data.location || f.location,
      }));
      setAiNote("Understood your request and filled the fields above.");
    } catch {
      setAiError("Could not reach the AI service. Please try again.");
    } finally {
      setAiLoading(false);
    }
  }


  async function search() {
    setLoading(true);
    setError(null);
    try {
      const rows = await searchListings(form.crop);
      setResults(scoreListings(rows, Number(form.qty) || 0, Number(form.price) || 0));
      setSearched(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="hero-wash">
        <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 lg:py-20">
          <h1 className="text-3xl font-semibold break-words sm:text-4xl lg:text-5xl">
            Find the Right Produce
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Tell us what you need and CropConnect will find the best available farmers.
          </p>

          <div className="mt-10 rounded-[1.75rem] border border-border bg-card p-6 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Crop needed">
                <Input value={form.crop} onChange={set("crop")} placeholder="Wheat" />
              </Field>
              <Field label="Quantity required (kg)">
                <Input
                  inputMode="numeric"
                  value={form.qty}
                  onChange={set("qty")}
                  placeholder="1000"
                />
              </Field>
              <Field label="Maximum price per kg (₹)">
                <Input
                  inputMode="numeric"
                  value={form.price}
                  onChange={set("price")}
                  placeholder="28"
                />
              </Field>
              <Field label="Buyer location">
                <Input value={form.location} onChange={set("location")} placeholder="Delhi" />
              </Field>
            </div>

            <div className="mt-8 rounded-2xl border border-primary/20 bg-secondary/50 p-5">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Sparkles className="h-4 w-4 text-primary" /> Or just describe what you need
              </Label>
              <Textarea
                rows={3}
                className="mt-3 bg-card"
                value={natural}
                onChange={(e) => setNatural(e.target.value)}
                placeholder="Example: Delhi ke paas 1 ton tomatoes chahiye under ₹22 per kg"
              />
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="rounded-full"
                  onClick={parseWithAI}
                  disabled={aiLoading}
                >
                  {aiLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  {aiLoading ? "Reading your request…" : "Search with AI"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  AI only reads your request and fills the fields. Matching stays fully
                  deterministic.
                </p>
              </div>
              {aiError && (
                <p className="mt-3 text-sm text-destructive">{aiError}</p>
              )}
              {aiNote && !aiError && (
                <p className="mt-3 text-sm text-primary">{aiNote}</p>
              )}
            </div>


            {error && (
              <p className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                {error}
              </p>
            )}

            <Button
              size="lg"
              className="mt-6 w-full rounded-full sm:w-auto sm:px-8"
              onClick={search}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {loading ? "Searching produce…" : "Find Smart Matches"}
            </Button>
          </div>

          {searched && !loading && (
            <section className="mt-12">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-2xl font-semibold">
                  {results.length} {results.length === 1 ? "farmer match" : "farmer matches"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Ranked by Match Score (price and quantity fit)
                </p>
              </div>

              {results.length === 0 ? (
                <p className="mt-6 rounded-[1.75rem] border border-dashed border-border bg-card/60 p-8 text-sm text-muted-foreground">
                  No available listings match that crop yet. Try a different crop name.
                </p>
              ) : (
                <div className="mt-6 space-y-4">
                  {results.map((m, i) => (
                    <article
                      key={m.id}
                      className="card-soft animate-rise grid gap-5 p-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                      style={{ animationDelay: `${Math.min(i, 8) * 90}ms` }}
                    >
                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-semibold">{m.farmer_name}</h3>
                        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">{m.crop}</span>
                          <span>{m.quantity_kg} kg available</span>
                          <span className="font-medium text-primary">₹{m.price_per_kg}/kg</span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {m.location}
                          </span>
                        </p>
                        <p className="mt-3 text-xs text-muted-foreground">
                          {m.notes.length ? m.notes.join(" • ") : "Available now"} • Harvested{" "}
                          {formatDate(m.harvest_date)}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-end">
                        <div className="text-right">
                          <p className="font-display text-3xl font-semibold text-primary">
                            {m.score}%
                          </p>
                          <p className="text-xs text-muted-foreground">Match Score</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 space-y-2">
      <Label className="text-sm">{label}</Label>
      {children}
    </div>
  );
}
