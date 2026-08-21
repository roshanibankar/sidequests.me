export type Status = "READING" | "RECOMMENDED" | "READ";

export type Book = {
  id: string;
  title: string;
  author: string | null;
  type: string;
  genre: string;
  status: Status;
  rating: number | null;
  coverUrl: string | null;
  review: string | null;
  createdAt: string;
  updatedAt: string;
};

export const TYPES = [
  "Fiction",
  "Non Fiction",
  "Biography",
  "Autobiography",
  "Other",
] as const;

export const STATUS_LABEL: Record<Status, string> = {
  READING: "Currently reading",
  RECOMMENDED: "Recommended",
  READ: "Finished",
};

// One color per Type — used for both the top tabs and the spine color,
// so the whole shelf reads by type at a glance.
export const TYPE_COLORS: Record<string, string> = {
  Fiction: "#3E6B8A", // slate blue
  "Non Fiction": "#4E7A51", // moss green
  Biography: "#C08A2E", // amber
  Autobiography: "#8A4E7A", // plum
  Other: "#5C6B73", // slate grey
};

export function typeColor(type: string): string {
  return TYPE_COLORS[type] ?? TYPE_COLORS.Other;
}
