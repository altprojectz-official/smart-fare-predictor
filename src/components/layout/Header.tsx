import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bike, BarChart3, Info, Sparkles, Calculator } from "lucide-react";

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Bike },
    { path: "/predict", label: "Predict Fare (Manual)", icon: Calculator },
    { path: "/smart-booking", label: "AI Smart Booking", icon: Sparkles },
    { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { path: "/about", label: "About", icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/Logo.png"
            alt="ML Smart Pricing System Logo"
            className="h-9 w-auto object-contain"
          />
          <span className="font-bold text-xl hidden sm:inline-block">
            ML Smart Pricing System
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={`gap-2 ${isActive ? "text-blue-600 bg-blue-50 hover:bg-blue-100" : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"}`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline-block font-medium">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;
