"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar({
  initialSearchTerm,
}: {
  initialSearchTerm: string;
}) {
  // State for entering a search term
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  // State for placeholder text animation
  const [index, setIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const placeholderOptions = [
    " a class",
    " CSEN 174",
    " OMIS 40",
    " ECON 101",
    " CHEM 12",
  ];

  // Change placeholder at regular intervals
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % placeholderOptions.length);
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(interval);
  }, [placeholderOptions.length]);

  // Handle forms in React
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  // Redirect to search results page after entering search term
  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm) router.push(`/search?searchterm=${searchTerm}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-16 flex items-center space-x-4 text-2xl font-medium rounded-lg px-4 border has-[:focus]:ring"
    >
      <label htmlFor="searchTerm">
        <Search className="size-6" />
      </label>
      <div className="relative w-full">
        <input
          type="text"
          id="searchTerm"
          className="w-full bg-inherit focus:outline-none border-0 focus:ring-0"
          value={searchTerm}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {!searchTerm && !isFocused && (
          <span className="absolute inset-0 flex items-center text-border pointer-events-none">
            Search for
            <span key={index} className="pl-2 transition-text">
              {placeholderOptions[index]}
            </span>
          </span>
        )}
      </div>
    </form>
  );
}
