import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Loader2, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createListing, formatDate, type CropListing } from "@/lib/listings";

export const Route = createFileRoute("/farmer")({
  head: () => ({
    meta: [
      { title: "Sell Your Harvest Smarter — CropConnect" },
      {
        name: "description",
        content:
          "Tell CropConnect what you've harvested, list it in seconds and reach buyers sourcing directly from farms.",
      },
      { property: "og:title", content: "Sell Your Harvest Smarter — CropConnect" },
      {
        property: "og:description",
        content: "Create a crop listing and reach buyers directly.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FarmerPage,
});

const empty = {
  name: "",
  crop: "",
  quantity: "",
  price: "",
  location: "",
  date: "",
  description: "",
};

function FarmerPage() {
  const [form, setForm] = useState(empty);
  const [natural, setNatural] = useState("");
  const [listing, setListing] = useState<CropListing | null>(null);
  const [loading, setLoading] = useState(false);
 const [errors, setErrors] = useState<Partial<Record<keyof typeof empty, string>>>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
const [aiError, setAiError] = useState<string | null>(null);

  const set = (k: keyof typeof empty) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));
  
async function fillWithAI() {
  if (!natural.trim()) {
    setAiError("Please describe your harvest first.");
    return;
  }

  setAiLoading(true);
  setAiError(null);

  try {
    const response = await fetch(
      `${import.meta.env["VITE_SUPABASE_URL"]}/functions/v1/parse-farmer-input`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"],
        },
        body: JSON.stringify({
          text: natural,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "AI could not understand the description.");
    }

    setForm((current) => ({
      ...current,
      crop: data.crop || "",
      quantity:
        data.quantity_kg !== null && data.quantity_kg !== undefined
          ? String(data.quantity_kg)
          : "",
      price:
        data.price_per_kg !== null && data.price_per_kg !== undefined
          ? String(data.price_per_kg)
          : "",
      location: data.location || "",
      date: data.harvest_date || "",
      description: data.description || "",
    }));
  } catch (error) {
    console.error(error);
    setAiError(
      "Couldn't process the description. Please try again or fill the fields manually."
    );
  } finally {
    setAiLoading(false);
  }
}
  function validate() {
    const next: Partial<Record<keyof typeof empty, string>> = {};
    if (!form.name.trim()) next.name = "Please enter the farmer name.";
    if (!form.crop.trim()) next.crop = "Please enter the crop.";
    if (!form.quantity.trim() || Number(form.quantity) <= 0)
      next.quantity = "Enter a quantity greater than 0.";
    if (!form.price.trim() || Number(form.price) <= 0)
      next.price = "Enter a price greater than 0.";
    if (!form.location.trim()) next.location = "Please enter the location.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit() {
    setSaveError(null);
    if (!validate()) return;
    setLoading(true);
    try {
      const saved = await createListing({
        farmer_name: form.name.trim(),
        crop: form.crop.trim(),
        quantity_kg: Number(form.quantity),
        price_per_kg: Number(form.price),
        location: form.location.trim(),
        harvest_date: form.date || null,
        description: form.description.trim() || null,
      });
      setListing(saved);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Something went wrong while saving.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setForm(empty);
    setNatural("");
    setListing(null);
    setErrors({});
    setSaveError(null);
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="hero-wash">
        <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 lg:py-20">
          <h1 className="text-3xl font-semibold break-words sm:text-4xl lg:text-5xl">
            Sell Your Harvest Smarter
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Tell CropConnect what you've harvested and we'll help structure your listing.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="min-w-0 rounded-[1.75rem] border border-border bg-card p-6 sm:p-8">
              <h2 className="text-lg font-semibold">Harvest details</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field label="Farmer Name" error={errors.name}>
                  <Input value={form.name} onChange={set("name")} placeholder="Rajesh Kumar" />
                </Field>
                <Field label="Crop" error={errors.crop}>
                  <Input value={form.crop} onChange={set("crop")} placeholder="Tomatoes" />
                </Field>
                <Field label="Quantity (kg)" error={errors.quantity}>
                  <Input
                    inputMode="numeric"
                    value={form.quantity}
                    onChange={set("quantity")}
                    placeholder="800"
                  />
                </Field>
                <Field label="Expected Price per kg (₹)" error={errors.price}>
                  <Input
                    inputMode="numeric"
                    value={form.price}
                    onChange={set("price")}
                    placeholder="18"
                  />
                </Field>
                <Field label="Location" error={errors.location}>
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
               <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
  <Button
    type="button"
    onClick={fillWithAI}
    disabled={aiLoading || !natural.trim()}
    className="rounded-full px-6"
  >
    {aiLoading ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Understanding...
      </>
    ) : (
      <>
        <Sparkles className="mr-2 h-4 w-4" />
        Fill with AI
      </>
    )}
  </Button>

  <p className="text-xs text-muted-foreground">
    Supports English, Hindi and Hinglish.
  </p>
</div>

{aiError && (
  <p className="mt-3 text-sm text-destructive">
    {aiError}
  </p>
)}
              </div>

              {saveError && (
                <p className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                  {saveError}
                </p>
              )}

              <Button
                size="lg"
                className="mt-6 w-full rounded-full sm:w-auto sm:px-8"
                onClick={submit}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4" />
                )}
                {loading ? "Saving listing…" : "Create Listing"}
              </Button>
            </div>

            <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
              {listing ? (
                <div className="animate-rise rounded-[1.75rem] border border-primary/25 bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Harvest listed successfully!
                  </span>
                  <h2 className="mt-4 text-2xl font-semibold break-words">{listing.crop}</h2>
                  <p className="text-sm text-muted-foreground">
                    {listing.farmer_name} · {listing.location}
                  </p>
                  <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                    <Stat label="Quantity" value={`${listing.quantity_kg} kg`} />
                    <Stat label="Asking price" value={`₹${listing.price_per_kg}/kg`} />
                    <Stat label="Harvested" value={formatDate(listing.harvest_date)} />
                    <Stat label="Status" value="Available" />
                  </dl>
                  {listing.description && (
                    <p className="mt-6 rounded-xl bg-muted p-4 text-sm text-muted-foreground">
                      {listing.description}
                    </p>
                  )}
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Button className="rounded-full" onClick={reset}>
                      List Another Crop
                    </Button>
                    <Button asChild variant="outline" className="rounded-full">
                      <Link to="/marketplace">View in marketplace</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="rounded-[1.75rem] border border-dashed border-border bg-card/60 p-8 text-sm text-muted-foreground">
                  Your listing summary will appear here once you create it.
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

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0 space-y-2">
      <Label className="text-sm">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium break-words">{value}</dd>
    </div>
  );
}
