import { Plus, School, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export default function UserClasses() {
  function ClassCard() {
    return (
      <div className="relative size-32 grid place-content-center rounded-lg border group">
        <School className="size-16" />
        Class #1
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className="hidden group-hover:grid absolute -top-3 -right-3 size-6 rounded-full place-content-center"
              >
                <X className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-destructive border-destructive text-destructive-foreground shadow-lg">
              <p>Remove Class</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }
  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="text-4xl font-semibold">Current Classes</div>
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <ClassCard />
        <ClassCard />
        <ClassCard />
        <ClassCard />
      </div>
      <div className="mx-auto w-fit">
        <Button size="default">
          <Plus className="size-6 mr-2" />
          Add Class
        </Button>
      </div>

      {/* <div className="text-2xl font-semibold">Past Classes</div>
      <div>Spring 2024</div>
      <PlaceholderClassesList />
      <div>Winter 2024</div>
      <PlaceholderClassesList />
      <div>Fall 2023</div>
      <PlaceholderClassesList /> */}
    </div>
  );
}
