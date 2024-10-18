import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function NumberResults() {
  return (
    <Select>
      <SelectTrigger className="w-36">
        <SelectValue placeholder="Default" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="9">9</SelectItem>
          <SelectItem value="12">12</SelectItem>
          <SelectItem value="30">30</SelectItem>
          <SelectItem value="48">48</SelectItem>
          <SelectItem value="60">60</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function SortBy() {
  return (
    <Select>
      <SelectTrigger className="w-36">
        <SelectValue placeholder="Default" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="relevance">Relevance</SelectItem>
          <SelectItem value="size">Size</SelectItem>
          <SelectItem value="downloads">Downloads</SelectItem>
          <SelectItem value="upvotes">Upvotes</SelectItem>
          <SelectItem value="views">Views</SelectItem>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
