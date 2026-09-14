import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/farmer")({
  head: () => ({
    meta: [
      { title: "Sell Your Harvest Smarter — CropConnect AI" },
      {
        name: "description",
        content:
          "Tell CropConnect what you've harvested and we'll structure your crop listing and match you with interested buyers.",
      },
      { property: "og:title", content: "Sell Your Harvest Smarter — CropConnect AI" },
      {
        property: "og:description",
        content: "Create an AI-structured crop listing and reach buyers directly.",
      },
    ],
  }),
  component: FarmerPage,
});

type Listing = {
  name: string;
  crop: string;
  quantity: string;
  price: string;
  location: string;
  date: string;
  description: string;
  quality: string;
  window: string;
};

const empty = {
  name: "",
  crop: "",
  quantity: "",
  price: "",
  location: "",
  date: "",
  description: "",
};

function parseNatural(text: string, base: typeof empty) {
  const qty = text.match(/(\d[\d,]*)\s*kg/i)?.[1]?.replace(/,/g, "");
  const price = text.match(/(?:₹|rs\.?\s*)(\d+(?:\.\d+)?)/i)?.[1];
  const crops = [
    "tomato",
    "wheat",
    "rice",
    "potato",
    "onion",
    "maize",
    "mustard",
    "sugarcane",
    "banana",
    "mango",
  ];
  const crop = crops.find((c) => text.toLowerCase().includes(c));
  const loc = text.match(/\b(?:in|near|at)\s+([A-Z][A-Za-z]+)/)?.[1];
  return {
    ...base,
    crop: base.crop || (crop ? crop[0].toUpperCase() + crop.slice(1) + "es".slice(0, 0) : ""),
    quantity: base.quantity || qty || "",
    price: base.price || price || "",
    location: base.location || loc || "",
    description: base.description || text.trim(),
  };
}

function FarmerPage() {
  const [form, setForm] = useState(empty);
  const [natural, setNatural] = useState("");
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof empty) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function generate() {
    setLoading(true);
    const merged = natural.trim() ? parseNatural(natural, form) : form;
    setTimeout(() => {
      setListing({
        name: merged.name || "Unnamed Farmer",
        crop: merged.crop || "Mixed Produce",
        quantity: merged.quantity || "—",
        price: merged.price || "—",
        location: merged.location || "Location not specified",
        date: merged.date || "Recently harvested",
        description:
          merged.description ||
          "Freshly harvested produce available for direct purchase from the farm.",
        quality: "Grade A · Farm-fresh · Direct from grower",
        window: "Best sold within 5–7 days of harvest",
      });
      setLoading(false);
    }, 700);
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="hero-wash">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:py-20">
          <h1 className="text-3xl font-semibold sm:text-4xl lg:text-5xl">
            Sell Your Harvest Smarter
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Tell CropConnect what you've harvested and we'll help structure your listing.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[1.75rem] border border-border bg-card p-6 sm:p-8">
              <h2 className="text-lg font-semibold">Harvest details</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field label="Farmer Name">
                  <Input value={form.name} onChange={set("name")} placeholder="Rajesh Kumar" />
                </Field>
                <Field label="Crop">
                  <Input value={form.crop} onChange={set("crop")} placeholder="Tomatoes" />
                </Field>
                <Field label="Quantity (kg)">
                  <Input
                    inputMode="numeric"
                    value={form.quantity}
                    onChange={set("quantity")}
                    placeholder="800"
                  />
                </Field>
                <Field label="Expected Price per kg (₹)">
                  <Input
                    inputMode="numeric"
                    value={form.price}
                    onChange={set("price")}
                    placeholder="18"
                  />
                </Field>
                <Field label="Location">
                  <Input
                    value={form.location}
                    onChange={set("location")}
                    placeholder="Sonipat, Haryana"
                  />
                </Field>
                <Field label="Harvest Date">
                  <Input type="date" value={form.date} onChange={set("date")} />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Crop description">
                    <Textarea
                      rows={3}
                      value={form.description}
                      onChange={set("description")}
                      placeholder="Ripe, uniform size, hand-picked, stored in shade."
                    />
                  </Field>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-primary/20 bg-secondary/50 p-5">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Sparkles className="h-4 w-4 text-primary" /> Describe your harvest naturally
                </Label>
                <Textarea
                  rows={4}
                  className="mt-3 bg-card"
                  value={natural}
                  onChange={(e) => setNatural(e.target.value)}
                  placeholder="Example: I have around 800 kg of tomatoes harvested yesterday in Sonipat and I'm looking for at least ₹18 per kg."
                />
              </div>

              <Button
                size="lg"
                className="mt-6 w-full rounded-full sm:w-auto sm:px-8"
                onClick={generate}
                disabled={loading}
              >
                <Wand2 className="h-4 w-4" />
                {loading ? "Structuring listing…" : "Create Listing with AI"}
              </Button>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              {listing ? (
                <div className="animate-rise rounded-[1.75rem] border border-primary/25 bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Listing ready
                  </span>
                  <h2 className="mt-4 text-2xl font-semibold">{listing.crop}</h2>
                  <p className="text-sm text-muted-foreground">
                    {listing.name} · {listing.location}
                  </p>
                  <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                    <Stat label="Quantity" value={`${listing.quantity} kg`} />
                    <Stat label="Asking price" value={`₹${listing.price}/kg`} />
                    <Stat label="Harvested" value={listing.date} />
                    <Stat label="Quality" value={listing.quality} />
                  </dl>
                  <p className="mt-6 rounded-xl bg-muted p-4 text-sm text-muted-foreground">
                    {listing.description}
                  </p>
                  <p className="mt-4 text-xs text-muted-foreground">{listing.window}</p>
                  <p className="mt-6 text-sm font-medium text-primary">
                    Estimated 4 buyers actively sourcing this crop nearby.
                  </p>
                </div>
              ) : (
                <div className="rounded-[1.75rem] border border-dashed border-border bg-card/60 p-8 text-sm text-muted-foreground">
                  Your structured listing preview will appear here once you create it.
                </div>
              )}
            </aside>
          </div>
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}
