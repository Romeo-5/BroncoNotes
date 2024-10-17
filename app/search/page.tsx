"use client";

import SearchBar from "@/components/search-bar";
import SearchResultCard from "@/components/search/result/card";
import { PaginationDemo } from "@/components/search/result/pagination";
import { NumberResults, SortBy } from "@/components/search/options";
import { useSearchParams } from "next/navigation";

// Placeholder note data
const exampleNotes = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    title: "Introduction to JavaScript",
    date: "2023-10-01T12:34:56Z",
    vote_count: 125,
    view_count: 1000,
    download_count: 450,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    title: "Advanced CSS Techniques",
    date: "2023-08-15T08:30:00Z",
    vote_count: 78,
    view_count: 600,
    download_count: 250,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    title: "Mastering React",
    date: "2023-09-10T14:20:10Z",
    vote_count: 200,
    view_count: 1500,
    download_count: 700,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    title: "Node.js for Beginners",
    date: "2023-07-20T09:15:30Z",
    vote_count: 95,
    view_count: 900,
    download_count: 300,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    title: "Understanding TypeScript",
    date: "2023-06-25T16:45:05Z",
    vote_count: 135,
    view_count: 1100,
    download_count: 550,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    title: "Building Web Apps with Next.js",
    date: "2023-05-10T11:00:00Z",
    vote_count: 160,
    view_count: 1200,
    download_count: 600,
  },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  return (
    <main className="container mx-auto flex flex-col justify-start items-center space-y-4 min-h-screen p-8 sm:p-16">
      <SearchBar initialSearchTerm={searchParams.get("searchterm")!} />
      <div className="flex w-full justify-between">
        <div>
          <div className="text-4xl font-semibold">
            Results for: {searchParams.get("searchterm")}
          </div>
          <div className="mt-1 text-xl">Showing 1-12 of 999 results</div>
        </div>
        <div className="flex h-full space-x-4">
          <div>
            <div>Results per page:</div>
            <div className="mt-2">
              <NumberResults />
            </div>
          </div>
          <div>
            <div>Sort By:</div>
            <div className="mt-2">
              <SortBy />
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {exampleNotes.map((note, index) => (
          <SearchResultCard key={index} note={note} />
        ))}
      </div>
      <PaginationDemo />
    </main>
  );
}
