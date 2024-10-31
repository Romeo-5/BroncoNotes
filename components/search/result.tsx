import { useState } from "react";
import { NumberResults, SortBy } from "./result/options";
import SearchResultCard from "./result/card";
import SearchPagination from "./result/pagination";
import { Note } from "@/lib/types";

export default function SearchResults({
  resultsTitle,
  results,
}: {
  resultsTitle: string;
  results: Note[];
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(3);
  const [sort, setSort] = useState("");
  const totalResults = results.length;
  // Paginate the results
  const paginatedNotes = results.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <div className="container mx-auto flex flex-col justify-start items-center space-y-4">
      <div className="flex w-full justify-between">
        <div>
          <div className="text-4xl font-semibold">{resultsTitle}</div>
          <div className="mt-1 text-xl">
            Showing {resultsPerPage * (currentPage - 1) + 1}-
            {Math.min(results.length, resultsPerPage * currentPage)} of{" "}
            {results.length} results
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
    </div>
  );
}
