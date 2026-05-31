/**
 * Detects when Next.js app CSS is loaded and Tailwind layout utilities are active.
 * Supports both legacy `/_next/static/css/` and Next 16+ `/_next/static/chunks/*.css`.
 */
export function findNextStylesheet(doc: Document): HTMLLinkElement | null {
  const links = doc.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]');
  for (const link of links) {
    const href = link.getAttribute("href") ?? link.href ?? "";
    if (!href.includes("/_next/static/")) continue;
    if (!/\.css($|\?)/i.test(href)) continue;
    if (link.sheet) return link;
  }
  return null;
}

export function probeTailwindUtilities(body: HTMLElement): boolean {
  const hidden = document.createElement("div");
  hidden.className = "hidden";
  body.appendChild(hidden);
  const hiddenOk = getComputedStyle(hidden).display === "none";
  hidden.remove();
  if (!hiddenOk) return false;

  const layout = document.createElement("div");
  layout.className = "flex fixed";
  body.appendChild(layout);
  const st = getComputedStyle(layout);
  const ok = st.display === "flex" && st.position === "fixed";
  layout.remove();
  return ok;
}

export function isStylesReady(doc: Document = document): boolean {
  if (!doc.body) return false;
  if (!findNextStylesheet(doc)) return false;
  return probeTailwindUtilities(doc.body);
}

export function markStylesReady(doc: Document = document): boolean {
  if (!isStylesReady(doc)) return false;
  const root = doc.documentElement;
  root.classList.remove("ito-boot-pending");
  root.classList.remove("ito-boot-failed");
  root.classList.add("ito-styles-ready");
  try {
    sessionStorage.removeItem("ito-style-boot");
    sessionStorage.removeItem("ito-chunk-recovery");
  } catch {
    /* ignore */
  }
  return true;
}
