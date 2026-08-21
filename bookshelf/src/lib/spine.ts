/** Small deterministic hash so each book always gets the same spine
 * width/height/shade — varied-looking, but stable across reloads. */
function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function spineWidth(id: string): number {
  return 30 + (hash(id + "w") % 22); // 30–52px
}

export function spineHeight(id: string): number {
  return 196 + (hash(id + "h") % 56); // 196–252px
}

export function spineTilt(id: string): number {
  // Most books stand straight; a few lean slightly, like a real shelf.
  const v = hash(id + "t") % 10;
  if (v === 0) return -3;
  if (v === 1) return 2;
  return 0;
}

export function shadeHex(hex: string, id: string): string {
  const variants = [-14, -4, 8];
  const percent = variants[hash(id + "c") % variants.length];
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const r = Math.min(255, Math.max(0, (num >> 16) + amt));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
