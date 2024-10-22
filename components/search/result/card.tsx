import Image from "next/image";
import ExampleNote from "@/public/example_note.png";
import { Download, Eye, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { formatDate, formatNumber } from "@/lib/utils";
import { Note } from "@/lib/types";

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
