import { MatrixRain } from "@/components/matrix-rain";
import { SiteFooter, SiteNav } from "@/components/site-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <MatrixRain />
      <SiteNav />
      <div className="relative z-10">{children}</div>
      <SiteFooter />
    </div>
  );
}
