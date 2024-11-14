"use client";

import SearchBar from "@/components/search/search-bar";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebaseConfig";
import SearchResults from "@/components/search/result";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/app/firebaseConfig";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("searchterm") ?? "";
  const router = useRouter();
  const [user, setUser] = useState<User | string | null>(
    "I am not null, idiot >:("
  );
  const [courseId, setCourseId] = useState("Course Not Found");

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

  useEffect(() => {
    const getCourseIdFromName = async () => {
      const courseQuery = query(
        collection(db, "courses"),
        where("course_name", "==", searchTerm)
      );
      const courseSnapshot = await getDocs(courseQuery);
      if (courseSnapshot.empty) setCourseId("Course Not Found");
      setCourseId(courseSnapshot.docs[0].id);
    };
    getCourseIdFromName();
  }, [searchTerm]);

  return (
    <main className="container mx-auto flex flex-col justify-start items-center space-y-4 h-[calc(100vh-64px)] p-8 sm:p-16">
      <SearchBar initialSearchTerm={searchTerm} />
      <SearchResults
        title={`Results for: ${searchTerm}`}
        query={query(
          collection(db, "notes"),
          where("course_id", "==", courseId)
        )}
      />
    </main>
  );
}
