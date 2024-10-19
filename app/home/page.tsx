import { Button } from "@/components/ui/button";
import { FilePlus2, Image } from "lucide-react";
import SearchBar from "@/components/search/search-bar";

// Placeholder classes
const exampleClasses = [
  {
    subject: "CSEN",
    number: "166",
  },
  {
    subject: "MATH",
    number: "178",
  },
  {
    subject: "CSCI",
    number: "160",
  },
  {
    subject: "OMIS",
    number: "40",
  },
  {
    subject: "ENGL",
    number: "181",
  },
];

export default function HomePage() {
  return (
    <main className="container mx-auto flex flex-col justify-start items-center space-y-4 min-h-screen p-8 sm:p-16">
      <div className="text-8xl font-bold text-center">BroncoNotes</div>
      {/** Search Bar */}
      <SearchBar initialSearchTerm="" />
      <div className="w-full h-[440px] flex space-x-1 *:rounded-lg *:border *:p-4">
        {/** Current Classes (Optional?) */}
        <div className="w-2/3">
          <div className="flex justify-between h-fit mb-2">
            <div>
              <div className="text-2xl font-semibold">Current Classes</div>
              <div>Fall 2024</div>
            </div>
            <Button size="sm">Edit</Button>
          </div>
          <div className="h-[344px] overflow-scroll">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 *:rounded-lg *:border *:p-4">
              {exampleClasses.map((value, index) => (
                <div
                  key={index}
                  className="aspect-square grid place-content-center space-y-2"
                >
                  <Image className="size-24" />
                  <div>
                    {value.subject} {value.number}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/** Upload Notes */}
        <div className="w-1/3 flex flex-col items-center justify-center gap-y-4">
          <FilePlus2 className="size-32 text-border" />
          <div className="text-4xl font-semibold text-border">Upload Notes</div>
        </div>
      </div>
    </main>
  );
}
