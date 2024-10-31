"use client";

import SearchBar from "@/components/search/search-bar";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { exampleNotes } from "@/lib/constants";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebaseConfig";
import SearchResults from "@/components/search/result";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [user, setUser] = useState<User | string | null>(
    "I am not null, idiot >:("
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      return setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (!user) {
    router.push("/");
    return null;
  }

  return (
    <main className="container mx-auto flex flex-col justify-start items-center space-y-4 min-h-screen p-8 sm:p-16">
      <SearchBar initialSearchTerm={searchParams.get("searchterm")!} />
      <SearchResults
        resultsTitle={`Results for: ${searchParams.get("searchterm")}`}
        results={exampleNotes}
      />
    </main>
  );
}
