import { Home, MapPin, Bell, User, Heart } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";

export function MobileNavbar() {
  const { t } = useLanguage();

  const navItems = [
    { to: "/mobile", icon: Home, labelKey: "home" },
    { to: "/mobile/mosques", icon: MapPin, labelKey: "mosques" },
    { to: "/mobile/notifications", icon: Bell, labelKey: "alerts" },
    { to: "/mobile/donate", icon: Heart, labelKey: "donate" },
    { to: "/mobile/profile", icon: User, labelKey: "profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg safe-area-bottom">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/mobile"}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors",
                isActive
                  ? "text-emerald"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-all",
                    isActive && "scale-110"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={cn(isActive && "font-medium")}>
                  {t(item.labelKey)}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
