import { Link } from "@tanstack/react-router";
import { Leaf, Menu } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function Logo() {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
        <Leaf className="h-5 w-5" />
      </span>
      <span className="font-display text-lg font-semibold tracking-tight">CropConnect AI</span>
    </Link>
  );
}

const links = [
  { label: "Home", href: "#top" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Impact", href: "#impact" },
];

export function SiteHeader({ landing = false }: { landing?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6">
        <Logo />
        <div className="flex items-center gap-2 sm:gap-6">
          {landing && (
            <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
              {links.map((l) => (
                <a key={l.label} href={l.href} className="transition-colors hover:text-foreground">
                  {l.label}
                </a>
              ))}
            </nav>
          )}
          {!landing && (
            <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
              <Link to="/farmer" className="transition-colors hover:text-foreground">
                For Farmers
              </Link>
              <Link to="/buyer" className="transition-colors hover:text-foreground">
                For Buyers
              </Link>
            </nav>
          )}
          <Button asChild size="sm" className="rounded-full px-5">
            <Link to="/farmer">Get Started</Link>
          </Button>
          {landing && (
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setOpen((v) => !v)}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-border md:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      {landing && open && (
        <nav className="flex flex-col gap-1 border-t border-border px-4 py-3 text-sm md:hidden">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2 text-muted-foreground hover:bg-muted"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-sm space-y-3">
          <Logo />
          <p className="text-sm text-muted-foreground">
            Building a more efficient and sustainable agricultural supply chain.
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex flex-wrap gap-4 text-muted-foreground">
            <Link to="/farmer" className="hover:text-foreground">
              List your crop
            </Link>
            <Link to="/buyer" className="hover:text-foreground">
              Find produce
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            Built for NextStep Hacks 2026 — Earth Forward
          </p>
        </div>
      </div>
    </footer>
  );
}
