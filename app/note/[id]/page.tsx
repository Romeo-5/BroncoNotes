import NotePreview from "@/components/note/note-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Flag } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PracticeTest from "@/components/note/practice-test";
import VoteButtons from "@/components/note/vote-buttons";
import { exampleClass, exampleNote, exampleSummary } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import ReportButton from "@/components/note/report-button";

export default function NotePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { tab: string | undefined };
}) {
  return (
    <main className="container mx-auto min-h-screen p-8 sm:p-16">
      <div className="w-full flex flex-col lg:flex-row items-start lg:items-end justify-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="text-6xl font-semibold">{exampleNote.title}</div>
        <div className="flex space-x-4">
          <VoteButtons initialCount={exampleNote.vote_count} />
          <Button variant={"outline"}>
            <Download className="size-6 mr-2" />
            <div className="whitespace-nowrap">Download</div>
          </Button>
          <ReportButton />
        </div>
      </div>
      <div className="text-3xl font-medium mt-2 text-border">
        Added {formatDate(exampleNote.uploaded_at)}
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
  );
}
