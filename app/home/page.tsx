"use client";

import { Button } from "@/components/ui/button";
import { FilePlus2, Image } from "lucide-react";
import SearchBar from "@/components/search/search-bar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { db } from "../../firebaseConfig"; 
import { doc, getDoc, setDoc } from "firebase/firestore";

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
    <main className="container mx-auto flex flex-col justify-start items-center space-y-4 min-h-screen p-8 sm:p-16">
      <div className="text-8xl font-bold text-center">BroncoNotes</div>
      
      {/* Search Bar */}
      <SearchBar initialSearchTerm="" />

      <div className="w-full h-[440px] flex space-x-1 *:rounded-lg *:border *:p-4">
        
        {/* Current Classes (Optional?) */}
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
        
        {/* Upload Notes */}
        <Link
          href="/upload"
          className="w-1/3 flex flex-col items-center justify-center gap-y-4"
        >
          <FilePlus2 className="size-32 text-border" />
          <div className="text-4xl font-semibold text-border">Upload Notes</div>
        </Link>
      </div>
    </main>
  );
}
