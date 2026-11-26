"use client";

import { useEffect } from "react";

export function CodeCopyHydrator() {
  useEffect(() => {
    const onClick = async (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const btn = target?.closest<HTMLButtonElement>("[data-copy-code]");
      if (!btn) return;

      const encoded = btn.getAttribute("data-copy-code");
      if (!encoded) return;

      try {
        await navigator.clipboard.writeText(decodeURIComponent(encoded));
        const original = btn.textContent;
        btn.textContent = "Copied";
        btn.style.borderColor = "#b7f36b";
        btn.style.color = "#b7f36b";
        setTimeout(() => {
          btn.textContent = original || "Copy";
          btn.style.borderColor = "";
          btn.style.color = "";
        }, 1600);
      } catch {
        // Clipboard unavailable
      }
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
