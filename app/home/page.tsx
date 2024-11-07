"use client";

import { Button } from "@/components/ui/button";
import { FilePlus2 } from "lucide-react";
import SearchBar from "@/components/search/search-bar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { db } from "../../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Check if the user exists in Firestore
        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          // Create a new user document in Firestore
          await setDoc(userRef, {
            user_id: currentUser.uid,
            name: currentUser.displayName,
            email: currentUser.email,
            role: "student", // default role
            joined_date: new Date().toISOString(),
            profile_photo_url: currentUser.photoURL,
            major: "", // default, can be updated by the user
            courses: [], // initial empty list of courses
            saved_notes: [], // initial empty list of saved notes
            upvoted_notes: [], // initial empty list of upvoted notes
            downvoted_notes: [], // initial empty list of downvoted notes
            reputation: 0, // default reputation
          });
          console.log("New user document created in Firestore.");
        } else {
          console.log("User already exists in Firestore.");
        }
      } else {
        setUser(null);
        router.push("/"); // Redirect to landing page if not authenticated
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (!user) {
    return null;
  }

  return (
    <main className="container mx-auto flex flex-col justify-center items-center space-y-4 h-[calc(100vh-64px)] p-8 sm:p-16">
      <div className="text-8xl font-bold text-center">BroncoNotes</div>

      {/* Search Bar */}
      <div className="w-full flex space-x-4">
        <SearchBar initialSearchTerm="" />
        <div className="text-border font-semibold flex items-center justify-center">
          Or
        </div>
        {/* Upload Notes */}
        <Link
          href="/upload"
          className="flex flex-col items-center justify-center"
        >
          <Button className="h-16 rounded-lg">
            <FilePlus2 className="size-8 mr-2" />
            <div className="text-2xl font-medium">Upload Notes</div>
          </Button>
        </Link>
      </div>
    </main>
  );
}
