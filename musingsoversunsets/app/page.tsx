import { getAllMusings } from "@/lib/musings";
import DiarySlideshow from "@/components/DiarySlideshow";

export default function Home() {
  const entries = getAllMusings();
  return <DiarySlideshow entries={entries} />;
}