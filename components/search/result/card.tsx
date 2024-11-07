"use client";

import Image from "next/image";
import { Download, Eye, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { formatDate, formatNumber } from "@/lib/utils";
import { QueryDocumentSnapshot } from "firebase/firestore";
import "react-pdf/dist/Page/TextLayer.css"; // See https://github.com/wojtekmaj/react-pdf?tab=readme-ov-file#support-for-text-layer
import { pdfjs, Document, Page } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function SearchResultCard({
  note,
}: {
  note: QueryDocumentSnapshot;
}) {
  const fileUrl = note.data().file_url;

  const isPDF = (fileUrl: string): boolean => {
    const url = new URL(fileUrl);
    const path = url.pathname; // This gives the path without the query string

    // Extract the file extension
    const extension = path.split(".").pop()?.toLowerCase();
    return extension === "pdf";
  };

  return (
    <Link href={`/note/${note.id}`} className="relative border rounded-lg">
      {isPDF(fileUrl) ? (
        <div className="rounded-t-lg min-w-full aspect-[17/22]">
          <Document file={fileUrl}>
            <Page
              pageIndex={0}
              width={340}
              className="round-pdf-top rounded-t-lg"
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </Document>
        </div>
      ) : (
        <Image
          src={fileUrl}
          alt={note.data().title}
          width={340}
          height={440}
          className="rounded-t-lg min-w-full aspect-[17/22]"
          priority
        />
      )}
      <div className="px-3 py-2">
        <div className="flex justify-between">
          <div>
            <div>{note.data().title}</div>
            <div className="text-border text-sm">
              Added {formatDate(note.data().upload_date)}
            </div>
          </div>
          <div className="w-fit min-w-10">
            <div className="flex items-center justify-between space-x-1">
              <ThumbsUp className="size-3" />
              <div className="text-xs">{formatNumber(note.data().rating)}</div>
            </div>
            <div className="flex items-center justify-between space-x-1">
              <Eye className="size-3" />
              <div className="text-xs">{formatNumber(note.data().views)}</div>
            </div>
            <div className="flex items-center justify-between space-x-1">
              <Download className="size-3" />
              <div className="text-xs">
                {formatNumber(note.data().downloads)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
