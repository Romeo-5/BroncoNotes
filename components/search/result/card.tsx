import Image from "next/image";
import ExampleNote from "@/public/example_note.png";
import { Download, Eye, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { Note } from "@/app/types";

// Helper function to convert date into readable string
function formatDate(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Helper function to format count numbers into readable strings
function formatNumber(num: number) {
  if (num < 1000) {
    return num.toString(); // Display full number for anything below 1000
  }

  const units = ["k", "M", "B", "T"];
  let unitIndex = -1;

  while (num >= 1000 && unitIndex < units.length - 1) {
    num /= 1000;
    unitIndex++;
  }

  // Round to two significant figures for anything >= 1000
  return `${num.toPrecision(3)}${units[unitIndex]}`;
}

export default function SearchResultCard({ note }: { note: Note }) {
  return (
    <Link href={`/note/${note.note_id}`} className="relative border rounded-lg">
      <Image
        src={ExampleNote}
        alt="Example Note"
        width={340}
        height={440}
        className="rounded-t-lg"
      />
      <div className="px-3 py-2">
        <div className="flex justify-between">
          <div>
            <div>{note.title}</div>
            <div className="text-border text-sm">
              Added {formatDate(note.uploaded_at)}
            </div>
          </div>
          <div className="w-fit min-w-10">
            <div className="flex items-center justify-between space-x-1">
              <ThumbsUp className="size-3" />
              <div className="text-xs">{formatNumber(note.vote_count)}</div>
            </div>
            <div className="flex items-center justify-between space-x-1">
              <Eye className="size-3" />
              <div className="text-xs">{formatNumber(note.view_count)}</div>
            </div>
            <div className="flex items-center justify-between space-x-1">
              <Download className="size-3" />
              <div className="text-xs">{formatNumber(note.download_count)}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
