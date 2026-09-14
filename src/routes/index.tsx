import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Leaf,
  Recycle,
  Route as RouteIcon,
  ShoppingBasket,
  
  Truck,
  Wind,
} from "lucide-react";

import heroImage from "@/assets/hero-connect.jpg";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CropConnect AI — From Farm to Market. Smarter." },
      {
        name: "description",
        content:
          "An AI-powered marketplace connecting farmers directly with buyers — reducing waste, shortening supply chains, and building a sustainable food system.",
      },
      { property: "og:title", content: "CropConnect AI — From Farm to Market. Smarter." },
      {
        property: "og:description",
        content:
          "AI-powered marketplace connecting farmers directly with crop buyers and wholesalers.",
      },
    ],
  }),
  component: Index,
});

const reasons = [
  {
    icon: Recycle,
    title: "Reduce Food Waste",
    body: "Connect harvested produce with demand before it goes to waste.",
  },
  {
    icon: RouteIcon,
    title: "Smarter Supply Chains",
    body: "Match buyers with suitable farmers instead of relying on inefficient multi-step sourcing.",
  },
  {
    icon: ShoppingBasket,
    title: "Better Market Access",
    body: "Give farmers a simple way to discover demand beyond their immediate local market.",
  },
];

const farmerSteps = [
  "Tell us what you've harvested",
  "AI structures your crop listing",
  "Get matched with interested buyers",
];
const buyerSteps = [
  "Tell us what you need",
  "AI searches available produce",
  "Get ranked farmer matches",
];

const stats = [
  { icon: Leaf, value: "12,450 kg", label: "Produce Matched" },
  { icon: Recycle, value: "1,830 kg", label: "Potential Food Waste Prevented" },
  { icon: Truck, value: "2,760 km", label: "Supply Chain Distance Reduced" },
  { icon: Wind, value: "386 kg", label: "Estimated CO₂ Avoided" },
];

function Index() {
  return (
    <div id="top" className="min-h-screen bg-background">
      <SiteHeader landing />

      <main>
        {/* Hero */}
        <section className="hero-wash">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
            <div className="animate-rise">
              <h1 className="mt-5 text-4xl leading-[1.05] font-semibold sm:text-5xl lg:text-6xl">
                From Farm to Market. <span className="text-gradient">Smarter.</span>
              </h1>
              <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
                An AI-powered marketplace connecting farmers directly with buyers — reducing waste,
                shortening supply chains, and creating a more sustainable food system.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full px-7">
                  <Link to="/farmer">
                    I'm a Farmer <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-primary/30 px-7 text-primary hover:bg-primary/5"
                >
                  <Link to="/buyer">I'm a Buyer</Link>
                </Button>
              </div>
            </div>
            <div className="animate-rise overflow-hidden rounded-[2rem] border border-border bg-card shadow-[var(--shadow-card)]">
              <img
                src={heroImage}
                alt="A farmer with crates of fresh produce connected through a digital network to a buyer with a delivery truck"
                width={1280}
                height={960}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Why */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <h2 className="text-3xl font-semibold sm:text-4xl">Why CropConnect?</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {reasons.map((r) => (
              <article key={r.title} className="card-soft p-7">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary">
                  <r.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{r.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{r.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="border-y border-border bg-secondary/30">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
            <h2 className="text-3xl font-semibold sm:text-4xl">How It Works</h2>
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {[
                { title: "For Farmers", steps: farmerSteps, to: "/farmer" as const, cta: "Start listing" },
                { title: "For Buyers", steps: buyerSteps, to: "/buyer" as const, cta: "Start sourcing" },
              ].map((col) => (
                <div key={col.title} className="rounded-[1.75rem] border border-border bg-card p-7">
                  <h3 className="text-xl font-semibold">{col.title}</h3>
                  <ol className="mt-6 space-y-5">
                    {col.steps.map((s, i) => (
                      <li key={s} className="flex min-w-0 items-start gap-4">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                          {i + 1}
                        </span>
                        <span className="pt-1 text-sm text-foreground/90">{s}</span>
                      </li>
                    ))}
                  </ol>
                  <Button asChild variant="ghost" className="mt-6 rounded-full px-4 text-primary">
                    <Link to={col.to}>
                      {col.cta} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact */}
        <section id="impact" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <h2 className="text-3xl font-semibold sm:text-4xl">Environmental Impact</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Every direct match removes steps, kilometres and spoilage from the food chain.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="card-soft p-6">
                <s.icon className="h-5 w-5 text-primary" />
                <p className="mt-5 font-display text-3xl font-semibold">{s.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Demonstration estimates based on simulated marketplace activity.
          </p>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="rounded-[2rem] border border-primary/20 bg-[image:var(--gradient-primary)] px-6 py-14 text-center text-primary-foreground sm:px-12">
            <h2 className="text-3xl font-semibold sm:text-4xl">
              Ready to build a smarter food supply chain?
            </h2>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" variant="secondary" className="rounded-full px-7">
                <Link to="/farmer">List Your Crop</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-primary-foreground/50 bg-transparent px-7 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link to="/buyer">Find Produce</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
