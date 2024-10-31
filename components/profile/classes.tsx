import { Plus, School, X } from "lucide-react";
import { Button } from "../ui/button";

export default function UserClasses() {
  function ClassCard() {
    return (
      <div className="relative size-32 grid place-content-center rounded-lg border group">
        <School className="size-16" />
        Class #1
        <Button
          variant="destructive"
          size="icon"
          className="hidden group-hover:grid absolute -top-3 -right-3 size-6 rounded-full place-content-center"
        >
          <X className="size-4" />
        </Button>
      </div>
    );
  }
  function PlaceholderClassesList() {
    return (
      <div className="py-4 flex items-center space-x-4">
        <ClassCard />
        <ClassCard />
        <ClassCard />
        <ClassCard />
        <Button className="size-16 rounded-full grid place-content-center">
          <Plus className="size-12" />
        </Button>
      </div>
    );
  }
  return (
    <div className="w-full flex flex-col">
      <div className="text-2xl font-semibold">Current Classes</div>
      <div>Fall 2024</div>
      <PlaceholderClassesList />
      <div className="text-2xl font-semibold">Past Classes</div>
      <div>Spring 2024</div>
      <PlaceholderClassesList />
      <div>Winter 2024</div>
      <PlaceholderClassesList />
      <div>Fall 2023</div>
      <PlaceholderClassesList />
    </div>
  );
}
