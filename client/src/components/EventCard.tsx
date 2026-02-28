import { Link } from "wouter";
import { Calendar, MapPin, Ticket, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  id: number;
  title: string;
  description?: string | null;
  category: string;
  imageUrl?: string | null;
  venue?: string | null;
  city?: string | null;
  country?: string | null;
  startDate: number;
  ticketPrice: string;
  capacity: number;
  ticketsSold: number;
  status: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  music: "oklch(0.65 0.2 300)",
  sports: "oklch(0.65 0.2 150)",
  arts: "oklch(0.65 0.2 30)",
  tech: "oklch(0.65 0.2 220)",
  food: "oklch(0.65 0.2 60)",
  business: "oklch(0.65 0.2 200)",
  general: "oklch(0.72 0.18 55)",
};

const CATEGORY_IMAGES: Record<string, string> = {
  music: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80",
  sports: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80",
  arts: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80",
  tech: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
  food: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
  business: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&q=80",
  general: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80",
};

export function formatEventDate(ms: number) {
  const d = new Date(ms);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatEventTime(ms: number) {
  const d = new Date(ms);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export default function EventCard({ id, title, description, category, imageUrl, venue, city, country, startDate, ticketPrice, capacity, ticketsSold, status }: EventCardProps) {
  const available = capacity - ticketsSold;
  const soldPct = Math.round((ticketsSold / capacity) * 100);
  const isSoldOut = available <= 0;
  const catColor = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.general;
  const fallbackImg = CATEGORY_IMAGES[category] ?? CATEGORY_IMAGES.general;
  const displayImg = imageUrl || fallbackImg;
  const price = parseFloat(ticketPrice);

  return (
    <Link href={`/events/${id}`}>
      <div className="glass-card rounded-xl overflow-hidden hover-lift cursor-pointer group h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={displayImg}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).src = fallbackImg; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-3 left-3">
            <span className="badge-category capitalize">{category}</span>
          </div>
          {isSoldOut && (
            <div className="absolute top-3 right-3 bg-destructive/90 text-destructive-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
              Sold Out
            </div>
          )}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div className="text-white">
              <p className="text-xs text-white/70 font-medium">{formatEventDate(startDate)}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-white">
                {price === 0 ? "Free" : `$${price.toFixed(2)}`}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-serif text-lg font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
              {description}
            </p>
          )}

          <div className="mt-auto space-y-1.5 pt-3 border-t border-border/50">
            {(venue || city) && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-primary/70" />
                <span className="truncate">{[venue, city, country].filter(Boolean).join(", ")}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="w-3.5 h-3.5 text-primary/70" />
                <span>{isSoldOut ? "Sold out" : `${available} left`}</span>
              </div>
              {!isSoldOut && (
                <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${soldPct}%`,
                      background: soldPct > 80 ? "oklch(0.55 0.22 25)" : "linear-gradient(90deg, oklch(0.72 0.18 55), oklch(0.62 0.2 55))",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
