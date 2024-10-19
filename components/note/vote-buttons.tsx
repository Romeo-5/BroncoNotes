"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip"; // Import tooltip components
import { formatNumber } from "@/lib/utils";
import { toast } from "@/hooks/use-toast"; // Import toast
import { v4 as uuidv4 } from "uuid";

export default function VoteButtons({
  initialCount,
}: {
  initialCount: number;
}) {
  const [vote, setVote] = useState(0);
  const [count, setCount] = useState(initialCount);

  const exampleVote = {
    vote_id: uuidv4(),
    note_id: uuidv4(),
    user_id: uuidv4(),
    vote: vote,
    timestamp: new Date().toISOString(),
  };

  useEffect(() => {
    toast({
      title: "Updated User Vote:",
      description: (
        <pre className="mt-2 rounded-md bg-foreground p-4">
          <code className="text-background">
            {JSON.stringify(exampleVote, null, 2)}
          </code>
        </pre>
      ),
    });
  }, [vote]);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex justify-between items-center whitespace-nowrap">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size={"icon"}
              onClick={() => setVote(vote == 1 ? 0 : 1)}
            >
              <ThumbsUp
                className={`${
                  vote == 1 ? "text-green-500" : "text-foreground"
                }`}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>Upvote</span>
          </TooltipContent>
        </Tooltip>

        <div className="px-2 font-semibold">{formatNumber(count + vote)}</div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size={"icon"}
              onClick={() => setVote(vote == -1 ? 0 : -1)}
            >
              <ThumbsDown
                className={`${vote == -1 ? "text-red-500" : "text-foreground"}`}
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
