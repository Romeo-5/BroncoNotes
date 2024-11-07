"use client";

import { Button } from "../ui/button";
import { Download } from "lucide-react";
import { db } from "@/firebaseConfig"; // Adjust path as needed
import { doc, updateDoc, increment } from "firebase/firestore";
import Link from "next/link";

export default function DownloadButton({
  noteId,
  fileUrl,
  download,
}: {
  noteId: string;
  fileUrl: string;
  download: string;
}) {
  const handleDownload = async () => {
    try {
      // Increment the downloads count in Firestore
      const noteRef = doc(db, "notes", noteId);
      await updateDoc(noteRef, {
        downloads: increment(1),
      });
    } catch (error) {
      console.error("Error incrementing download count:", error);
    }
  };

  return (
    <Link href={fileUrl} target="_blank" download={download}>
      <Button variant="outline" onClick={handleDownload}>
        <Download className="size-6 mr-2" />
        <div className="whitespace-nowrap">Download</div>
      </Button>
    </Link>
  );
}
