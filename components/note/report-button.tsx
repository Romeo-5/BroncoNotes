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
import { useState } from "react";
import { Label } from "../ui/label";
import { toast } from "@/hooks/use-toast";
import { DialogDescription } from "@radix-ui/react-dialog";
import { v4 as uuidv4 } from "uuid";
import { timeStamp } from "console";

export default function ReportButton() {
  const [reportMessage, setReportMessage] = useState("");

  // Object structure of a report
  const exampleReport = {
    report_id: uuidv4(),
    note_id: uuidv4(),
    user_id: uuidv4(),
    report_message: reportMessage,
    timestamp: new Date().toISOString(),
    status: "pending",
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
