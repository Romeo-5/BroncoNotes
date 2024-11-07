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
import { db } from "@/firebaseConfig"; // Import Firestore configuration
import { doc, updateDoc, increment, getDoc } from "firebase/firestore";

export default function VoteButtons({ noteId }: { noteId: string }) {
  const [vote, setVote] = useState(0); // -1 for downvote, 0 for no vote, 1 for upvote
  const [count, setCount] = useState(0); // Initial count from Firestore

  // Fetch current vote count from Firestore on component mount
  useEffect(() => {
    const fetchVoteCount = async () => {
      try {
        const noteRef = doc(db, "notes", noteId);
        const noteDoc = await getDoc(noteRef);

        if (noteDoc.exists()) {
          const data = noteDoc.data();
          setCount(data.rating || 0); // Set initial vote count
        }
      } catch (error) {
        console.error("Error fetching vote count:", error);
      }
    };

    fetchVoteCount();
  }, [noteId]);

  // Function to update the vote count in Firestore
  const updateVoteCount = async (incrementValue: number) => {
    try {
      const noteRef = doc(db, "notes", noteId);
      await updateDoc(noteRef, {
        rating: increment(incrementValue),
      });
      setCount((prev) => prev + incrementValue);
    } catch (error) {
      console.error("Error updating vote count:", error);
    }
  };

  const handleUpvote = () => {
    if (vote === 1) {
      setVote(0);
      updateVoteCount(-1); // Remove upvote
    } else {
      setVote(1);
      updateVoteCount(vote === -1 ? 2 : 1); // Convert downvote to upvote or add upvote
    }
  };

  const handleDownvote = () => {
    if (vote === -1) {
      setVote(0);
      updateVoteCount(1); // Remove downvote
    } else {
      setVote(-1);
      updateVoteCount(vote === 1 ? -2 : -1); // Convert upvote to downvote or add downvote
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
