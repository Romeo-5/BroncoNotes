"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/app/firebaseConfig";
import Image from "next/image";
import { exampleNotes } from "@/lib/constants";
import UserClasses from "@/components/profile/classes";
import SearchResults from "@/components/search/result";
import { Trash2 } from "lucide-react";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tooltip } from "@radix-ui/react-tooltip";

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
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
    typeof user !== "string" && (
      <main className="container mx-auto min-h-screen p-8 sm:p-16">
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
            defaultValue={tab === "myclasses" ? "myclasses" : "mynotes"}
            className="flex-1 overflow-hidden flex flex-col space-y-4 items-center"
          >
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="myclasses" className="font-semibold">
                My Classes
              </TabsTrigger>
              <TabsTrigger value="mynotes" className="font-semibold">
                My Notes
              </TabsTrigger>
              <TabsTrigger value="savednotes" className="font-semibold">
                Saved Notes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="myclasses" className="w-full">
              <UserClasses />
            </TabsContent>
            <TabsContent value="mynotes" className="w-full">
              <SearchResults resultsTitle="My Notes" results={exampleNotes} />
            </TabsContent>
            <TabsContent value="savednotes" className="w-full">
              <SearchResults
                resultsTitle="Saved Notes"
                results={exampleNotes}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    )
  );
}
