"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

export default function VoteButtons({
  initialCount,
}: {
  initialCount: number;
}) {
  // State for upvoting or downvoting
  // +1 for upvote, -1 for downvote
  // 0 for no vote as default
  const [vote, setVote] = useState(0);

  return (
    <div className="flex justify-between items-center whitespace-nowrap">
      <Button
        variant="ghost"
        size={"icon"}
        onClick={() => setVote(vote == 1 ? 0 : 1)}
      >
        <ThumbsUp
          className={`${vote == 1 ? "text-green-500" : "text-foreground"}`}
        />
      </Button>
      <div className="px-2 font-semibold">{initialCount}</div>
      <Button
        variant="ghost"
        size={"icon"}
        onClick={() => setVote(vote == -1 ? 0 : -1)}
      >
        <ThumbsDown
          className={`${vote == -1 ? "text-red-500" : "text-foreground"}`}
        />
      </Button>
    </div>
  );
}
