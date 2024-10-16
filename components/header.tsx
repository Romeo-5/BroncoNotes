import { LibraryBig } from "lucide-react";
import { ModeToggle } from "./ui/mode-toggle";
import { Button } from "./ui/button";

export function Header() {
  return (
    <div className="w-screen h-16 px-4 flex space-x-4 items-center">
      <LibraryBig className="size-10" />
      <Button variant="ghost">About</Button>
      <div className="flex-1"></div>
      <ModeToggle />
      <Button>Login</Button>
    </div>
  );
}
