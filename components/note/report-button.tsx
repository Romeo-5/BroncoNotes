"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "../ui/button";
import { Flag } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useState, useEffect } from "react";
import { Label } from "../ui/label";
import { toast } from "@/hooks/use-toast";
import { DialogDescription } from "@radix-ui/react-dialog";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/app/firebaseConfig"; // Import Firestore configuration
import {
  doc,
  updateDoc,
  increment,
  getDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

export default function ReportButton({
    noteId,
    userId,
  }: {
    noteId: string;
    userId: string;
}) {
  const [reportMessage, setReportMessage] = useState("");
  const [vote, setVote] = useState(0); // -1 for downvote, 0 for no vote, 1 for upvote
  const [count, setCount] = useState(0); // Initial count from Firestore

  // Object structure of a report
  const exampleReport = {
    report_id: uuidv4(),
    note_id: uuidv4(),
    user_id: uuidv4(),
    report_message: reportMessage,
    timestamp: new Date().toISOString(),
    status: "pending",
  };
    // Fetch initial vote count and user's vote status for this note
    useEffect(() => {
      const fetchVoteData = async () => {
        try {
          const noteRef = doc(db, "notes", noteId);
          const userRef = doc(db, "users", userId);
  
          const [noteDoc, userDoc] = await Promise.all([
            getDoc(noteRef),
            getDoc(userRef),
          ]);
  
          if (noteDoc.exists()) {
            setCount(noteDoc.data().rating || 0);
          }
  
          if (userDoc.exists()) {
            const { upvoted_notes = [], downvoted_notes = [] } = userDoc.data();
            if (upvoted_notes.includes(noteId)) {
              setVote(1);
            } else if (downvoted_notes.includes(noteId)) {
              setVote(-1);
            }
          }
        } catch (error) {
          console.error("Error fetching vote data:", error);
        }
      };
  
      fetchVoteData();
    }, [noteId, userId]);

   // Function to update both the note's vote count and user's vote history
   const updateVoteCount = async (incrementValue: number, isUpvote: boolean) => {
    try {
      const noteRef = doc(db, "notes", noteId);
      const userRef = doc(db, "users", userId);

      // Update the vote count on the note
      await updateDoc(noteRef, {
        rating: increment(incrementValue),
      });

      // Update user's upvoted/downvoted notes
      if (isUpvote) {
        await updateDoc(userRef, {
          upvoted_notes: arrayUnion(noteId),
          downvoted_notes: arrayRemove(noteId),
        });
      } else {
        await updateDoc(userRef, {
          upvoted_notes: arrayRemove(noteId),
          downvoted_notes: arrayUnion(noteId),
        });
      }

      setCount((prev) => prev + incrementValue);
    } catch (error) {
      console.error("Error updating vote:", error);
    }
  };

  const onSubmit = () => {
    toast({
      title: "You submitted the following report:",
      description: (
        <pre className="mt-2 rounded-md bg-foreground p-4">
          <code className="text-background">
            {JSON.stringify(exampleReport, null, 2)}
          </code>
        </pre>
      ),
    });
    if (vote === -5) {
      setVote(0);
      updateVoteCount(5, false); // Remove downvote
    } else {
      setVote(-1);
      updateVoteCount(vote === 1 ? -2 : -5, false); // Convert upvote to downvote or add downvote
    }
    setReportMessage("");

  };


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"destructive"}>
          <Flag className="size-6 mr-2" />
          <div className="whitespace-nowrap">Report</div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Report Note</DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>
          <Label htmlFor="report-message" className="font-semibold">
            Please describe why you reported this note
          </Label>
        </DialogDescription>
        <Textarea
          id="report-message"
          placeholder="(Optional) Enter your reponse here"
          value={reportMessage}
          onChange={(e) => setReportMessage(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          Your response will be seen by our admin team
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"}>Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={onSubmit}>Submit</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
