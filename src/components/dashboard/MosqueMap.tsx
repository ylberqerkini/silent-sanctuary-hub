import { MapPin } from "lucide-react";

const mosques = [
  { id: 1, name: "Masjid Al-Haram", city: "Makkah", status: "active" },
  { id: 2, name: "Al-Masjid an-Nabawi", city: "Madinah", status: "active" },
  { id: 3, name: "Al-Aqsa Mosque", city: "Jerusalem", status: "active" },
  { id: 4, name: "Islamic Center NYC", city: "New York", status: "pending" },
  { id: 5, name: "East London Mosque", city: "London", status: "active" },
];

export function MosqueMap() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-serif text-lg font-semibold text-foreground">
            Active Mosques
          </h3>
          <p className="text-sm text-muted-foreground">
            Worldwide coverage
          </p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          1,247 Total
        </span>
      </div>

      {/* Placeholder for actual map - would use mapbox or similar */}
      <div className="relative mb-4 h-48 overflow-hidden rounded-lg bg-gradient-to-br from-emerald-light to-muted">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm font-medium text-primary">
              Interactive Map Coming Soon
            </p>
          </div>
        </div>
        
        {/* Decorative dots representing mosques */}
        <div className="absolute left-[20%] top-[30%] h-3 w-3 animate-pulse rounded-full bg-primary" />
        <div className="absolute left-[40%] top-[25%] h-3 w-3 animate-pulse rounded-full bg-primary" style={{ animationDelay: "0.2s" }} />
        <div className="absolute left-[60%] top-[40%] h-3 w-3 animate-pulse rounded-full bg-primary" style={{ animationDelay: "0.4s" }} />
        <div className="absolute left-[75%] top-[35%] h-3 w-3 animate-pulse rounded-full bg-gold" style={{ animationDelay: "0.6s" }} />
        <div className="absolute left-[30%] top-[60%] h-3 w-3 animate-pulse rounded-full bg-primary" style={{ animationDelay: "0.8s" }} />
      </div>

      {/* Recent mosques list */}
      <div className="space-y-3">
        {mosques.map((mosque) => (
          <div
            key={mosque.id}
            className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-2"
          >
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">{mosque.name}</p>
                <p className="text-xs text-muted-foreground">{mosque.city}</p>
              </div>
            </div>
            <span
              className={`h-2 w-2 rounded-full ${
                mosque.status === "active" ? "bg-success" : "bg-warning"
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
