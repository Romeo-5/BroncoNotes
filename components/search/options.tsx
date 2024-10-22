import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function NumberResults({
  state,
}: {
  state: [number, React.Dispatch<number>];
}) {
  const handleChange = (value: string) => {
    state[1](Number(value)); // Update notesPerPage based on selected value
  };

  return (
    <div>
      <div>Results per page:</div>
      <div className="mt-2">
        <Select onValueChange={handleChange} defaultValue="3">
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="9">9</SelectItem>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="48">48</SelectItem>
              <SelectItem value="60">60</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function SortBy({ state }: { state: [string, React.Dispatch<string>] }) {
  const handleChange = (value: string) => {
    state[1](value); // Update notesPerPage based on selected value
  };

  return (
    <div>
      <div>Sort By:</div>
      <div className="mt-2">
        <Select onValueChange={handleChange} defaultValue="relevance">
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="downloads">Downloads</SelectItem>
              <SelectItem value="upvotes">Upvotes</SelectItem>
              <SelectItem value="views">Views</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
