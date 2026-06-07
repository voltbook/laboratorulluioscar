"use client";

import { Zap } from "lucide-react";

export function OliverShadowLabPlayButton() {
  const launchGame = async () => {
    const shell = document.getElementById("oliver-shadow-lab-shell");
    document.getElementById("play")?.scrollIntoView({ behavior: "smooth", block: "start" });

    try {
      if (shell && !document.fullscreenElement) {
        await shell.requestFullscreen();
      }
      const orientation = screen.orientation as ScreenOrientation & { lock?: (orientation: "landscape") => Promise<void> };
      await orientation.lock?.("landscape").catch(() => undefined);
    } catch {
      // Some mobile browsers only allow fullscreen/orientation after a second tap.
    }

    window.dispatchEvent(new Event("oliver-shadow-lab:launch"));
    window.dispatchEvent(new Event("resize"));
  };

  return (
    <button className="lab-button lab-button-primary mt-8" onClick={launchGame} type="button">
      <Zap className="h-4 w-4" />
      Play
    </button>
  );
}
