"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithGoogle, logout, auth } from "@/app/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      return setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (user) {
    router.push("/home");
    return null;
  }

  return (
    <main className="container mx-auto flex flex-col justify-center items-center space-y-4 min-h-screen p-8 sm:p-16">
      <div className="text-9xl font-bold text-center">BroncoNotes</div>
      <div className="flex justify-center">
        <Link href="/home">
          <Button
            onClick={signInWithGoogle}
            size={"lg"}
            className="h-fit w-fit text-2xl px-6 py-4"
          >
            Login with Google
          </Button>
        </Link>
      </div>
    </main>
  );
}
