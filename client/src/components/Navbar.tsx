import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link, useLocation } from "wouter";
import { Ticket, LayoutDashboard, LogOut, ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const [location, navigate] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => {
      window.location.href = "/";
    },
    onError: () => toast.error("Logout failed"),
  });

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const navLinks = [
    { href: "/events", label: "Browse Events" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50"
      style={{
        background: "oklch(0.08 0.01 260 / 0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}>
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, oklch(0.78 0.16 55), oklch(0.62 0.2 55))" }}>
              <Ticket className="w-4 h-4 text-black" />
            </div>
            <span className="font-serif text-xl font-semibold tracking-tight text-gradient-gold">
              bbpass
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => navigate("/organizer")}
                >
                  <LayoutDashboard className="w-4 h-4 mr-1.5" />
                  Dashboard
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-secondary transition-colors">
                      <Avatar className="w-7 h-7">
                        <AvatarFallback className="text-xs font-semibold bg-primary text-primary-foreground">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-foreground max-w-[100px] truncate">
                        {user?.name ?? "Account"}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                    <DropdownMenuItem onClick={() => navigate("/my-tickets")} className="cursor-pointer">
                      <Ticket className="w-4 h-4 mr-2" />
                      My Tickets
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/organizer")} className="cursor-pointer">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Organizer Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => logout.mutate()}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                size="sm"
                className="font-semibold"
                style={{ background: "linear-gradient(135deg, oklch(0.78 0.16 55), oklch(0.62 0.2 55))", color: "oklch(0.08 0.01 260)" }}
                onClick={() => (window.location.href = getLoginUrl())}
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border/50 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link href="/my-tickets" className="block px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors" onClick={() => setMobileOpen(false)}>
                  My Tickets
                </Link>
                <Link href="/organizer" className="block px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors" onClick={() => setMobileOpen(false)}>
                  Organizer Dashboard
                </Link>
                <button
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-destructive hover:bg-secondary rounded-lg transition-colors"
                  onClick={() => { logout.mutate(); setMobileOpen(false); }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="px-4 pt-2">
                <Button
                  className="w-full font-semibold"
                  style={{ background: "linear-gradient(135deg, oklch(0.78 0.16 55), oklch(0.62 0.2 55))", color: "oklch(0.08 0.01 260)" }}
                  onClick={() => (window.location.href = getLoginUrl())}
                >
                  Sign In
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export { Navbar };
