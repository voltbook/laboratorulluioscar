import Link from "next/link";
import { FlaskConical, LayoutDashboard, Library, LogIn, Sparkles, Star } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/generator", label: "Generator AI", icon: Sparkles },
  { href: "/community", label: "Community", icon: Library },
  { href: "/saved", label: "Saved", icon: Star },
  { href: "/admin/seed", label: "Seed", icon: FlaskConical },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-primary/20 bg-black/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-mono text-sm font-semibold text-white">
          <span className="grid h-8 w-8 place-items-center border border-primary/50 bg-primary/10 text-primary shadow-[0_0_20px_rgba(0,255,102,0.2)]">O</span>
          <span>Laboratorul Lui Oscar</span>
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="flex items-center gap-2 px-3 py-2 font-mono text-xs text-muted-foreground transition hover:bg-primary/10 hover:text-primary">
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </div>
        <Link href="/auth" className="lab-button h-9 px-3">
          <LogIn className="h-4 w-4" />
          Login
        </Link>
      </nav>
    </header>
  );
}
