"use client";

import SearchBar from "@/components/search/search-bar";
import SearchResultCard from "@/components/search/result/card";
import SearchPagination from "@/components/search/result/pagination";
import { NumberResults, SortBy } from "@/components/search/options";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { exampleNotes } from "@/lib/constants";

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
    <main className="container mx-auto flex flex-col justify-start items-center space-y-4 min-h-screen p-8 sm:p-16">
      <SearchBar initialSearchTerm={searchParams.get("searchterm")!} />
      <div className="flex w-full justify-between">
        <div>
          <div className="text-4xl font-semibold">
            Results for: {searchParams.get("searchterm")}
          </div>
          <div className="mt-1 text-xl">
            Showing {resultsPerPage * (currentPage - 1) + 1}-
            {Math.min(exampleNotes.length, resultsPerPage * currentPage)} of{" "}
            {exampleNotes.length} results
          </div>
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
