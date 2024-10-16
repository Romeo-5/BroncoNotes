import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FilePlus2, Image, Search } from "lucide-react";
import SearchBar from "@/components/searchbar";

export default function Home() {
  return (
    <main className="grid grid-cols-1 items-center justify-items-center min-h-screen p-8 sm:p-20">
      <div className="w-[1156px] flex flex-col items-center space-y-4">
        <div className="text-8xl font-bold">BroncoNotes</div>
        {/** Search Bar */}
        <SearchBar />
        <div className="w-full flex space-x-1 *:rounded-lg *:border *:p-4">
          {/** Current Classes */}
          <div className="w-2/3">
            <div className="flex justify-between h-fit mb-2">
              <div>
                <div className="text-2xl font-semibold">Current Classes</div>
                <div>Fall 2024</div>
              </div>
              <Button size="sm">Edit</Button>
            </div>
            <div className="grid grid-cols-4 gap-2 *:rounded-lg *:border *:p-4">
              {[1, 2, 3, 4, 5].map((value) => {
                return (
                  <div
                    key={value}
                    className="aspect-square flex flex-col items-center space-y-2"
                  >
                    <Image className="size-24" />
                    <div>Class #{value}</div>
                  </div>
                );
              })}
            </div>
          </div>
          {/** Upload Notes */}
          <div className="w-1/3 flex flex-col items-center justify-center gap-y-4">
            <FilePlus2 className="size-32 text-border" />
            <div className="text-4xl font-semibold text-border">
              Upload Notes
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
