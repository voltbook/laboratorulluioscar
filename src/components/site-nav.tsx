import Image from "next/image";
import Link from "next/link";
import { FlaskConical, Gamepad2, LayoutDashboard, Library, LogIn, Sparkles } from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: FlaskConical },
  { href: "/#games", label: "Games", icon: Gamepad2 },
  { href: "/generator", label: "Project Generator", icon: Sparkles },
  { href: "/community", label: "Community", icon: Library },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-primary/20 bg-black/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3 font-mono text-sm font-semibold text-white">
          <Image src="/brand/oscar-laboratory-logo.png" alt="Oscar's Laboratory logo" width={44} height={44} className="h-10 w-10 shrink-0 object-contain" priority />
          <span className="hidden truncate sm:inline">Oscar&apos;s Laboratory</span>
        </Link>
        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="flex items-center gap-2 px-3 py-2 font-mono text-xs text-muted-foreground transition hover:bg-primary/10 hover:text-primary">
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Link href="/generator" className="lab-button lab-button-primary h-9 px-3">
            Enter Lab
          </Link>
          <Link href="/auth" className="lab-icon-button h-9 w-9" aria-label="Login">
            <LogIn className="h-4 w-4" />
          </Link>
        </div>
      </nav>
      <div className="grid grid-cols-5 border-t border-primary/10 lg:hidden">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="flex flex-col items-center gap-1 px-1 py-2 font-mono text-[10px] text-muted-foreground">
            <link.icon className="h-4 w-4 text-primary" />
            <span className="max-w-full truncate">{link.label}</span>
          </Link>
        ))}
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-primary/15 bg-black/60 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/brand/oscar-laboratory-logo.png" alt="Oscar's Laboratory logo" width={48} height={48} className="h-11 w-11 object-contain" />
          <div>
            <p className="font-mono text-sm text-white">Oscar&apos;s Laboratory</p>
            <p className="text-xs text-muted-foreground">Play. Build. Learn. Create.</p>
          </div>
        </Link>
        <p className="max-w-xl text-xs leading-5 text-muted-foreground">
          Educational games, AI project generator, science experiments, coding challenges, robotics and creative entertainment.
        </p>
      </div>
    </footer>
  );
}
