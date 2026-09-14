import { supabase } from "@/integrations/supabase/client";

export type CropListing = {
  id: string;
  farmer_name: string;
  crop: string;
  quantity_kg: number;
  price_per_kg: number;
  location: string;
  harvest_date: string | null;
  description: string | null;
  status: string;
  created_at: string;
};

export type NewListing = {
  farmer_name: string;
  crop: string;
  quantity_kg: number;
  price_per_kg: number;
  location: string;
  harvest_date: string | null;
  description: string | null;
};

export async function createListing(input: NewListing): Promise<CropListing> {
  const { data, error } = await supabase
    .from("crop_listings")
    .insert(input)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as CropListing;
}

export async function fetchAvailableListings(): Promise<CropListing[]> {
  const { data, error } = await supabase
    .from("crop_listings")
    .select("*")
    .eq("status", "available")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as CropListing[];
}

export async function searchListings(crop: string): Promise<CropListing[]> {
  let query = supabase.from("crop_listings").select("*").eq("status", "available");
  if (crop.trim()) query = query.ilike("crop", `%${crop.trim()}%`);
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as CropListing[];
}

export type ScoredListing = CropListing & { score: number; notes: string[] };

export function scoreListings(
  listings: CropListing[],
  requestedQty: number,
  maxPrice: number,
): ScoredListing[] {
  return listings
    .map((l) => {
      let score = 100;
      const notes: string[] = [];

      if (requestedQty > 0) {
        if (l.quantity_kg >= requestedQty) {
          notes.push("Full quantity available");
        } else {
          const shortage = (requestedQty - l.quantity_kg) / requestedQty;
          score -= Math.round(shortage * 40);
          notes.push("Partial quantity available");
        }
      }

      if (maxPrice > 0) {
        if (l.price_per_kg <= maxPrice) {
          notes.push("Within your budget");
        } else {
          const over = (l.price_per_kg - maxPrice) / maxPrice;
          score -= Math.round(Math.min(over, 1) * 50);
          notes.push("Above your target price");
        }
      }

      return { ...l, score: Math.max(0, Math.min(100, score)), notes };
    })
    .sort((a, b) => b.score - a.score);
}

export function formatDate(value: string | null) {
  if (!value) return "Not specified";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
