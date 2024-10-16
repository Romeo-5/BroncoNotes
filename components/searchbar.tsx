"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function SearchBar() {
  const [index, setIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  const placeholderOptions = [" a class", " CSEN 146", " MATH 53", " ECON 101"];

  // Change placeholder at regular intervals
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % placeholderOptions.length);
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(interval);
  }, [placeholderOptions.length]);

  return (
    <form className="w-full h-16 flex items-center space-x-4 text-2xl font-medium rounded-lg px-4 border has-[:focus]:ring">
      <label htmlFor="searchTerm">
        <Search className="size-6" />
      </label>
      <div className="relative w-full">
        <input
          type="text"
          id="searchTerm"
          className="w-full bg-inherit focus:outline-none border-0 focus:ring-0"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {!isFocused && (
          <span className="absolute inset-0 flex items-center text-border pointer-events-none">
            Search for
            <span
              key={index} // This forces React to re-render when the index changes
              className="pl-2 transition-text"
            >
              {placeholderOptions[index]}
            </span>
          </span>
        )}
      </div>
    </form>
  );
}
