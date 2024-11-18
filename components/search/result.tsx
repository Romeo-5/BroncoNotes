import { useEffect, useState } from "react";
import { NumberResults, SortBy } from "./result/options";
import SearchResultCard from "./result/card";
import SearchPagination from "./result/pagination";
import { getDocs, Query, QueryDocumentSnapshot } from "firebase/firestore";

export default function SearchResults({
  title,
  query,
}: {
  title: string;
  query: Query;
}) {
  const [queryResults, setQueryResults] = useState<QueryDocumentSnapshot[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(3);
  const [sort, setSort] = useState("");

  useEffect(() => {
    const getResults = async () => {
      const querySnapshot = await getDocs(query);
      if (querySnapshot.empty) {
        setQueryResults([]);
      } else {
        console.dir(querySnapshot.docs.map((doc) => doc.data()));
        setQueryResults(querySnapshot.docs);
      }
    };
    getResults();
  }, [query]);

  const totalResults = queryResults.length;
  // Paginate the results
  const paginatedNotes = queryResults.slice(
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
          <div className="text-4xl font-semibold">{title}</div>
          <div className="mt-1 text-xl">
            Showing {resultsPerPage * (currentPage - 1) + 1}-
            {Math.min(queryResults.length, resultsPerPage * currentPage)} of{" "}
            {queryResults.length} results
          </div>
        </div>
        <div className="flex h-full space-x-4">
          <NumberResults state={[resultsPerPage, setResultsPerPage]} />
          <SortBy state={[sort, setSort]} />
        </div>
      </div>
      {paginatedNotes.length ? (
        <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {paginatedNotes.map((note, index) => (
            <SearchResultCard key={index} note={note} />
          ))}
        </div>
      ) : (
        <div className="text-destructive text-2xl">No notes found.</div>
      )}
      <SearchPagination
        currentPage={currentPage}
        totalResults={totalResults}
        resultsPerPage={resultsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
