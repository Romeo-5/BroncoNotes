import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="grid grid-cols-1 items-center justify-items-center min-h-screen p-8 sm:p-20">
      <div className="flex flex-col items-center space-y-4">
        <div className="text-9xl font-bold">BroncoNotes</div>
        <Link href="/home">
          <Button size={"lg"} className="h-fit w-fit text-2xl px-6 py-4">
            Login with Google
          </Button>
        </Link>
      </div>
    </main>
  );
}
