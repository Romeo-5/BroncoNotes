"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/app/firebaseConfig";
import Image from "next/image";
import SearchResults from "@/components/search/result";
import { Trash2 } from "lucide-react";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tooltip } from "@radix-ui/react-tooltip";
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/app/firebaseConfig";

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const router = useRouter();
  const [user, setUser] = useState<User | string | null>(
    "I am not null, idiot >:("
  );
  const [userInfo, setUserInfo] = useState<DocumentData>({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      return setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || typeof user === "string") return;
    const getUserInfo = async () => {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) setUserInfo(userDocSnapshot.data());
    };
    getUserInfo();
  }, [user]);

  if (!user) {
    router.push("/");
    return null;
  }

  if (typeof user === "string") return null;

  return (
    typeof user !== "string" && (
      <main className="container mx-auto h-[calc(100vh-64px)] p-8 sm:p-16">
        <div className="flex w-full">
          <Image
            className=" size-24 rounded-full"
            width={96}
            height={96}
            src={user.photoURL ?? "/public/BroncoNotes Logo.png"}
            alt="User profile photo"
          />
          <div className="ml-6">
            <div className="whitespace-nowrap font-bold text-6xl">
              {user.displayName}
            </div>
            <div className="whitespace-nowrap text-border text-3xl">
              {user.email}
            </div>
          </div>
          <div className="flex-1"></div>
          <div className="flex flex-col justify-center">
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="destructive" size="icon">
                    <Trash2 className="size-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-destructive text-destructive-foreground">
                  <p className="font-bold">Delete Account</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="flex space-x-4"></div>
        <div className="w-full flex flex-col lg:flex-row justify-between space-x-0 space-y-8 lg:space-x-16 lg:space-y-0 mt-9">
          <Tabs
            defaultValue={tab === "mynotes" ? "mynotes" : "savednotes"}
            className="flex-1 overflow-hidden flex flex-col space-y-4 items-center"
          >
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="mynotes" className="font-semibold">
                My Notes
              </TabsTrigger>
              <TabsTrigger value="savednotes" className="font-semibold">
                Saved Notes
              </TabsTrigger>
            </TabsList>
            <TabsContent value="mynotes" className="w-full">
              <SearchResults
                title="My Notes"
                query={query(
                  collection(db, "notes"),
                  where("user_id", "==", user.uid)
                )}
              />
            </TabsContent>
            <TabsContent value="savednotes" className="w-full">
              <SearchResults
                title="Saved Notes"
                query={query(
                  collection(db, "notes"),
                  where(
                    "__name__",
                    "in",
                    userInfo.saved_notes?.length
                      ? userInfo.saved_notes
                      : ["not null"]
                  )
                )}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    )
  );
}
