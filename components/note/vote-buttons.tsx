"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { formatNumber } from "@/lib/utils";
import { db } from "@/app/firebaseConfig"; // Import Firestore configuration
import {
  doc,
  updateDoc,
  increment,
  getDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

export default function VoteButtons({
  noteId,
  userId,
}: {
  noteId: string;
  userId: string;
}) {
  const [vote, setVote] = useState(0); // -1 for downvote, 0 for no vote, 1 for upvote
  const [count, setCount] = useState(0); // Initial count from Firestore

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

  const handleUpvote = () => {
    if (vote === 1) {
      setVote(0);
      updateVoteCount(-1, true); // Remove upvote
    } else {
      setVote(1);
      updateVoteCount(vote === -1 ? 2 : 1, true); // Convert downvote to upvote or add upvote
    }
  };

  const handleDownvote = () => {
    if (vote === -1) {
      setVote(0);
      updateVoteCount(1, false); // Remove downvote
    } else {
      setVote(-1);
      updateVoteCount(vote === 1 ? -2 : -1, false); // Convert upvote to downvote or add downvote
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex justify-between items-center whitespace-nowrap">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={handleUpvote}>
              <ThumbsUp
                className={`${
                  vote === 1 ? "text-green-500" : "text-foreground"
                }`}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>Upvote</span>
          </TooltipContent>
        </Tooltip>

        <div className="px-2 font-semibold">{formatNumber(count)}</div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={handleDownvote}>
              <ThumbsDown
                className={`${
                  vote === -1 ? "text-red-500" : "text-foreground"
                }`}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>Downvote</span>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
