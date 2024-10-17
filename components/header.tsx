import { Library, LibraryBig } from "lucide-react";
import { ModeToggle } from "./ui/mode-toggle";
import { Button } from "./ui/button";
import Link from "next/link";

export function Header() {
  return (
    <div className="w-screen h-16 px-4 flex space-x-2 items-center">
      <Link href="/">
        <Button variant={"ghost"} size={"icon"}>
          <Library />
        </Button>
      </Link>
      <Button variant="ghost">About</Button>
      <div className="flex-1"></div>
      <ModeToggle />
      <Button>Login</Button>
    </div>
  );
}
