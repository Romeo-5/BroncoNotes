"use client";

import { ModeToggle } from "./ui/mode-toggle";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { signInWithGoogle, logout, auth } from "@/app/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import Logo from "@/public/BroncoNotes Logo.png";

export function Header() {
  const [user, setUser] = useState<User | string | null>(
    "I am not null, idiot >:("
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      return setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="sticky top-0 z-10 w-screen h-16 px-4 flex space-x-2 items-center">
      <Link href="/">
        <Button variant={"ghost"} size={"icon"}>
          <Image
            src={Logo}
            alt="We have not named him yet"
            width={64}
            height={64}
          />
        </Button>
      </Link>
      <Button variant="ghost">About</Button>
      <div className="flex-1"></div>
      <ModeToggle />
      {user && typeof user !== "string" ? (
        <>
          <Button variant="ghost" onClick={logout}>
            Logout
          </Button>
          <Link href="/profile">
            <Button size="icon">
              <Image
                className="size-10 rounded-lg"
                width={40}
                height={40}
                src={user.photoURL ?? "/public/BroncoNotes Logo.png"}
                alt="User profile photo"
              />
            </Button>
          </Link>
        </>
      ) : (
        <Button onClick={signInWithGoogle}>Login</Button>
      )}
    </div>
  );
}
