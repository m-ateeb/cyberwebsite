import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NOTES } from "@/data/notes";
import { NoteReaderClient } from "@/components/NoteReaderClient";

export function generateStaticParams() {
  return NOTES.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/notes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const note = NOTES.find((n) => n.slug === slug);
  if (!note) {
    return { title: "Note Not Found — StratumSec" };
  }
  return {
    title: `${note.title} — StratumSec`,
    description: note.subtitle,
  };
}

export default async function NotePage({ params }: PageProps<"/notes/[slug]">) {
  const { slug } = await params;
  const note = NOTES.find((n) => n.slug === slug);

  if (!note) {
    notFound();
  }

  return <NoteReaderClient note={note} />;
}
