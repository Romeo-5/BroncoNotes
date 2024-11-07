"use client";

import NotePreview from "@/components/note/note-preview";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PracticeTest from "@/components/note/practice-test";
import VoteButtons from "@/components/note/vote-buttons";
import { exampleClass, exampleNote, exampleSummary } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import ReportButton from "@/components/note/report-button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/firebaseConfig";
import {
  updateDoc,
  doc,
  increment,
  getDoc,
  DocumentData,
} from "firebase/firestore";
import SaveButton from "@/components/note/save-button";
import DownloadButton from "@/components/note/download-button";

export default function NotePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { tab: string | undefined };
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | string | null>(
    "I am not null, idiot >:("
  );
  const [noteData, setNoteData] = useState<DocumentData>({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      return setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
  if (!user) {
    router.push("/");
    return null;
  }

  useEffect(() => {
    if (user) {
      const incrementViewCount = async () => {
        try {
          const noteRef = doc(db, "notes", params.id);
          await updateDoc(noteRef, {
            views: increment(1),
          });
        } catch (error) {
          console.error("Error updating view count: ", error);
        }
      };

      incrementViewCount();
    }
  }, [user, params.id]);

  // Fetch note data from Firestore
  useEffect(() => {
    const fetchNoteData = async () => {
      try {
        const noteRef = doc(db, "notes", params.id);
        const noteSnapshot = await getDoc(noteRef);

        if (noteSnapshot.exists()) {
          setNoteData(noteSnapshot.data());
        } else {
          console.error("Note not found");
        }
      } catch (error) {
        console.error("Error fetching note data:", error);
      }
    };

    fetchNoteData();
  }, [params.id]);

  return (
    typeof user !== "string" && (
      <main className="container mx-auto h-[calc(100vh-64px)] p-8 sm:p-16">
        <div className="w-full flex flex-col lg:flex-row items-start lg:items-end justify-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="text-6xl font-semibold">{noteData.title}</div>
          <div className="flex space-x-4">
            <VoteButtons noteId={params.id} />
            <SaveButton noteId={params.id} userId={user.uid} />
            <DownloadButton noteId={params.id} fileUrl={noteData.file_url} />
            <ReportButton />
          </div>
        </div>
        <div className="text-3xl font-medium mt-2 text-border">
          Added {formatDate(noteData.upload_date)}
        </div>
        <div className="mt-2 flex space-x-3">
          <Badge className="whitespace-nowrap">
            {exampleClass.department} {exampleClass.number}
          </Badge>
          <Badge className="whitespace-nowrap">{exampleClass.quarter}</Badge>
          {exampleNote.tags.map((tag, index) => (
            <Badge key={index} className="whitespace-nowrap">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="w-full flex flex-col lg:flex-row justify-between space-x-0 space-y-8 lg:space-x-16 lg:space-y-0 mt-9 pl-12">
          <NotePreview />
          <Tabs
            defaultValue={
              searchParams.tab === "practice" ? "practice" : "summary"
            }
            className="flex-1 ml-16 overflow-hidden flex flex-col space-y-4 items-center"
          >
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="summary" className="font-semibold">
                Summary
              </TabsTrigger>
              <TabsTrigger value="practice" className="font-semibold">
                Practice Test
              </TabsTrigger>
            </TabsList>
            <TabsContent value="summary" className="w-full">
              <div className="whitespace-pre-wrap">{exampleSummary}</div>
            </TabsContent>
            <TabsContent value="practice" className="w-full">
              <PracticeTest />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    )
  );
}
