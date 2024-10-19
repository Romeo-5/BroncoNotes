import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="container mx-auto grid items-center place-content-center gap-y-4 min-h-screen p-24 sm:p-32">
      <div className="text-9xl font-bold text-center">BroncoNotes</div>
      <div className="flex justify-center">
        <Link href="/home">
          <Button size={"lg"} className="h-fit w-fit text-2xl px-6 py-4">
            Login with Google
          </Button>
        </Link>
      </div>
    </main>
  );
}
