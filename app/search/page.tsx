"use client";

import SearchBar from "@/components/search/search-bar";
import SearchResultCard from "@/components/search/result/card";
import SearchPagination from "@/components/search/result/pagination";
import { NumberResults, SortBy } from "@/components/search/options";
import { useSearchParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Note } from "../types";
import { useState } from "react";

// Placeholder note data
const exampleNotes: Note[] = [
  {
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
  },
  {
    note_id: uuidv4(),
    user_id: uuidv4(),
    course_id: uuidv4(),
    title: "Data Structures and Algorithms",
    uploaded_at: "2024-03-20T09:15:00.000Z",
    file_url:
      "https://firebasestorage.googleapis.com/v0/b/project-1234/o/notes/dsa.pdf",
    tags: ["data structures", "algorithms", "cs101"],
    view_count: 9820,
    vote_count: 1452,
    download_count: 2525,
  },
  {
    note_id: uuidv4(),
    user_id: uuidv4(),
    course_id: uuidv4(),
    title: "Advanced Calculus Notes",
    uploaded_at: "2024-05-01T13:45:00.000Z",
    file_url:
      "https://firebasestorage.googleapis.com/v0/b/project-1234/o/notes/adv_calc.pdf",
    tags: ["calculus", "math", "problem sets"],
    view_count: 6750,
    vote_count: 568,
    download_count: 743,
  },
  {
    note_id: uuidv4(),
    user_id: uuidv4(),
    course_id: uuidv4(),
    title: "History of Ancient Civilizations",
    uploaded_at: "2024-02-10T11:00:00.000Z",
    file_url:
      "https://firebasestorage.googleapis.com/v0/b/project-1234/o/notes/ancient_history.pdf",
    tags: ["history", "ancient civilizations", "lecture notes"],
    view_count: 8300,
    vote_count: 134340,
    download_count: 1560,
  },
  {
    note_id: uuidv4(),
    user_id: uuidv4(),
    course_id: uuidv4(),
    title: "Introduction to Psychology",
    uploaded_at: "2024-03-28T15:30:00.000Z",
    file_url:
      "https://firebasestorage.googleapis.com/v0/b/project-1234/o/notes/psych101.pdf",
    tags: ["psychology", "cognitive science", "lecture notes"],
    view_count: 18450,
    vote_count: 2690,
    download_count: 3245,
  },
  {
    note_id: uuidv4(),
    user_id: uuidv4(),
    course_id: uuidv4(),
    title: "Physics - Quantum Mechanics",
    uploaded_at: "2024-04-10T14:00:00.000Z",
    file_url:
      "https://firebasestorage.googleapis.com/v0/b/project-1234/o/notes/quantum_physics.pdf",
    tags: ["physics", "quantum mechanics", "homework solutions"],
    view_count: 15230,
    vote_count: 1802,
    download_count: 2340,
  },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(3);
  const [sort, setSort] = useState("");
  const totalResults = exampleNotes.length;

  // Paginate the results
  const paginatedNotes = exampleNotes.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <main className="container mx-auto flex flex-col justify-start items-center space-y-4 min-h-screen p-24 sm:p-32">
      <SearchBar initialSearchTerm={searchParams.get("searchterm")!} />
      <div className="flex w-full justify-between">
        <div>
          <div className="text-4xl font-semibold">
            Results for: {searchParams.get("searchterm")}
          </div>
          <div className="mt-1 text-xl">Showing 1-12 of 999 results</div>
        </div>
        <div className="flex h-full space-x-4">
          <NumberResults state={[resultsPerPage, setResultsPerPage]} />
          <SortBy state={[sort, setSort]} />
        </div>
      </div>
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {paginatedNotes.map((note, index) => (
          <SearchResultCard key={index} note={note} />
        ))}
      </div>
      <SearchPagination
        currentPage={currentPage}
        totalResults={totalResults}
        resultsPerPage={resultsPerPage}
        onPageChange={handlePageChange}
      />
    </main>
  );
}
