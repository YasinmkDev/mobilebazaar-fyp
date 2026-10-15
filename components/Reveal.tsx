"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Scroll-reveal motion system — hardened version.
// The first version scanned the DOM once on mount, so any content that
// appeared later (client-side navigation, suspense-rendered shop cards)
// stayed invisible forever. This version:
//  1. observes every [data-reveal] element, present and future, via a
//     MutationObserver (client navigations included),
//  2. re-scans on every route change,
//  3. force-reveals everything after 1.6s as a safety net — content can
//     never stay hidden, the animation is only an enhancement.
export default function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    const seen = new WeakSet<Element>();
    let io: IntersectionObserver | null = null;

    const reveal = (el: Element) => el.classList.add("revealed");

    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              reveal(e.target);
              io?.unobserve(e.target);
            }
          }
        },
        { threshold: 0.08, rootMargin: "0px 0px -4% 0px" }
      );
    }

    const scan = () => {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el, i) => {
        if (seen.has(el)) return;
        seen.add(el);
        el.style.transitionDelay = `${(i % 4) * 55}ms`;
        if (io) io.observe(el);
        else reveal(el);
      });
    };

    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    // Safety net: nothing stays hidden, whatever happens.
    const safety = window.setTimeout(() => {
      document.querySelectorAll("[data-reveal]").forEach(reveal);
    }, 1600);

    return () => {
      mo.disconnect();
      io?.disconnect();
      window.clearTimeout(safety);
    };
  }, [pathname]);

  return null;
}
