import NotePreview from "@/components/note/note-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Flag } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PracticeTest from "@/components/note/practice-test";
import VoteButtons from "@/components/note/vote-buttons";
import { v4 as uuidv4 } from "uuid";
import { Class, Note } from "@/app/types";

// Placeholder note data from Firestore, queried using param.id
const exampleNote: Note = {
  note_id: uuidv4(),
  user_id: uuidv4(),
  course_id: uuidv4(),
  title: "Introduction to Machine Learning",
  uploaded_at: "2024-04-15T10:30:00.000Z",
  file_url:
    "https://firebasestorage.googleapis.com/v0/b/project-1234/o/notes/ml_intro.pdf",
  tags: ["machine learning", "ai", "lecture notes"],
  view_count: 12500,
  vote_count: 785,
  download_count: 1045,
};

// Placeholder course data, queried from note.course_id
const exampleClass: Class = {
  course_id: exampleNote.course_id,
  course_name: "Software Engineering",
  department: "CSEN",
  number: "174",
  quarter: "Fall 2024",
  professor: "Dr. Kai Lukoff",
  description: "Introductory programming concepts in Python",
  note_count: 50,
};
// Placeholder Lorem Ipsum text for AI-generated summary
const exampleSummary = `Ipsam officiis et qui laborum placeat adipisci iste. Sed amet illum voluptatem sunt quibusdam. Assumenda nihil possimus qui aspernatur accusamus reprehenderit rem. Qui facere sed facere dignissimos.

Ut nam repellat quaerat. Repellendus harum sunt et reprehenderit. In nam impedit commodi. Asperiores velit cumque consequatur quasi sunt maxime deserunt. Necessitatibus unde ut autem quae numquam voluptates. Quos maiores ipsa neque libero.

Ad corporis quibusdam et eius quidem labore id. Autem architecto architecto temporibus hic aut nam voluptatem aut. Necessitatibus unde excepturi sed esse. Error id commodi facilis at. Id rem porro voluptatem est beatae sit at.

Enim similique suscipit iste mollitia qui impedit dolor. Cupiditate consequatur dolor et autem veritatis et non earum. Ut ut sequi ratione voluptatum id. Nesciunt harum ut dolores illum.`;

// Helper function to convert date into readable string
function formatDate(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function NotePage({ params }: { params: { id: string } }) {
  return (
    <main className="container mx-auto min-h-screen p-24 sm:p-32">
      <div className="w-full flex flex-col lg:flex-row items-start lg:items-end justify-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="text-6xl font-semibold">{exampleNote.title}</div>
        {/** Upvote/Downvote Buttons */}
        <div className="flex space-x-4">
          <VoteButtons initialCount={exampleNote.vote_count} />
          <Button variant={"outline"}>
            <Download className="size-6 mr-2" />
            <div className="whitespace-nowrap">Download</div>
          </Button>
          <Button variant={"destructive"}>
            <Flag className="size-6 mr-2" />
            <div className="whitespace-nowrap">Report</div>
          </Button>
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
          defaultValue="summary"
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
