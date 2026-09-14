import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Search, Sparkles } from "lucide-react";
import { useState } from "react";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/buyer")({
  head: () => ({
    meta: [
      { title: "Find the Right Produce — CropConnect AI" },
      {
        name: "description",
        content:
          "Tell CropConnect what produce you need and get ranked farmer matches by price, quantity and distance.",
      },
      { property: "og:title", content: "Find the Right Produce — CropConnect AI" },
      {
        property: "og:description",
        content: "Source directly from farmers with AI-ranked matches.",
      },
    ],
  }),
  component: BuyerPage,
});

const matches = [
  {
    name: "Rajesh Kumar",
    crop: "Wheat",
    qty: "1200 kg available",
    price: "₹26/kg",
    place: "Sonipat, Haryana",
    score: 92,
    notes: "Excellent price • Sufficient quantity • Close to buyer",
  },
  {
    name: "Amit Singh",
    crop: "Wheat",
    qty: "1500 kg available",
    price: "₹27/kg",
    place: "Panipat, Haryana",
    score: 87,
    notes: "Large volume • Fair price • Moderate distance",
  },
  {
    name: "Suresh Yadav",
    crop: "Wheat",
    qty: "900 kg available",
    price: "₹25/kg",
    place: "Rohtak, Haryana",
    score: 81,
    notes: "Lowest price • Slightly short on quantity • Further away",
  },
];

function BuyerPage() {
  const [form, setForm] = useState({ crop: "", qty: "", price: "", location: "" });
  const [natural, setNatural] = useState("");
  const [loading, setLoading] = useState(false);
  const [shown, setShown] = useState(false);

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function search() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShown(true);
    }, 800);
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="hero-wash">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:py-20">
          <h1 className="text-3xl font-semibold sm:text-4xl lg:text-5xl">Find the Right Produce</h1>
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
                placeholder="Example: I need 1000 kg of wheat near Delhi under ₹28/kg."
              />
            </div>

            <Button
              size="lg"
              className="mt-6 w-full rounded-full sm:w-auto sm:px-8"
              onClick={search}
              disabled={loading}
            >
              <Search className="h-4 w-4" />
              {loading ? "Searching produce…" : "Find Smart Matches"}
            </Button>
          </div>

          {shown && (
            <section className="mt-12">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-2xl font-semibold">3 farmer matches</h2>
                <p className="text-sm text-muted-foreground">Ranked by price, volume and distance</p>
              </div>
              <div className="mt-6 space-y-4">
                {matches.map((m, i) => (
                  <article
                    key={m.name}
                    className="card-soft animate-rise grid gap-5 p-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                    style={{ animationDelay: `${i * 90}ms` }}
                  >
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-semibold">{m.name}</h3>
                      <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{m.crop}</span>
                        <span>{m.qty}</span>
                        <span className="font-medium text-primary">{m.price}</span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {m.place}
                        </span>
                      </p>
                      <p className="mt-3 text-xs text-muted-foreground">{m.notes}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-end">
                      <div className="text-right">
                        <p className="font-display text-3xl font-semibold text-primary">
                          {m.score}%
                        </p>
                        <p className="text-xs text-muted-foreground">Match</p>
                      </div>
                      <Button variant="outline" className="rounded-full border-primary/30 text-primary hover:bg-primary/5">
                        Contact farmer
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
              <p className="mt-6 text-xs text-muted-foreground">
                Demonstration matches based on simulated marketplace activity.
              </p>
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
