// app/upload/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { FilePlus2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebaseConfig";

const SubmitNotes = () => {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const [user, setUser] = useState<User | string | null>(
    "I am not null, idiot >:("
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      return setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (!user) {
    router.push("/");
    return null;
  }

  // Accepted file types
  const acceptedFileTypes = ["application/pdf", "image/jpeg", "image/png"];

  // Handle File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      // Check if the file type is allowed
      if (!acceptedFileTypes.includes(uploadedFile.type)) {
        setErrorMessage("Only PDF, JPG, and PNG files are allowed.");
        setFile(null);
        setFilePreview(null);
        return;
      }

      // Clear any previous error message
      setErrorMessage(null);
      setFile(uploadedFile);

      // Show preview if it's an image
      if (uploadedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string); // Save the preview as a base64 URL
        };
        reader.readAsDataURL(uploadedFile);
      } else {
        // For non-image files (PDF), we'll just show the file name
        setFilePreview(null);
      }
    }
  };

  // Handle Drop File
  const handleDropFile = (e: React.DragEvent<HTMLInputElement>) => {
    e.preventDefault();
    const uploadedFile = e.dataTransfer.files?.[0];
    if (uploadedFile) {
      // Check if the file type is allowed
      if (!acceptedFileTypes.includes(uploadedFile.type)) {
        setErrorMessage("Only PDF, JPG, and PNG files are allowed.");
        setFile(null);
        setFilePreview(null);
        return;
      }

      // Clear any previous error message
      setErrorMessage(null);
      setFile(uploadedFile);

      // Show preview if it's an image
      if (uploadedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string); // Save the preview as a base64 URL
        };
        reader.readAsDataURL(uploadedFile);
      } else {
        // For non-image files (PDF), we'll just show the file name
        setFilePreview(null);
      }
    }
  };

  // Handle removing the file (optional)
  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
  };

  // Handle selecting quarter and year
  const handleChangeQuarter = () => {};
  const handleChangeYear = () => {};

  return (
    <div className="container mx-auto p-4">
      <div className="text-6xl font-bold mb-8">Upload Notes</div>
      <div className="flex flex-col md:flex-row space-y-8 space-x-0 md:space-y-0 md:space-x-8">
        {/* Left Section - Upload File */}
        <div className="h-[550px] aspect-[17/22] mx-auto">
          {/* Conditionally Render Upload Box or Preview */}
          {!file ? (
            <div
              className="border border-dashed p-8 h-[550px] flex flex-col items-center justify-center space-y-2 rounded-lg"
              onDrop={handleDropFile} // Add dropping files
              onDragOver={(event) => event.preventDefault()}
            >
              <Label htmlFor="file-upload" className="cursor-pointer">
                <FilePlus2 className="size-32 text-border" />
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden" // Hide the file input
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </Label>
              <div className="text-border font-bold text-3xl">Upload Files</div>
              <div className="text-border">
                or (pls dont) drag and drop files here
              </div>

              {errorMessage && (
                <p className="text-red-500 mt-2">{errorMessage}</p>
              )}
            </div>
          ) : (
            <div className="border border-dashedp-8 h-[550px] flex flex-col items-center justify-center rounded-lg">
              {filePreview ? (
                // Show image preview if the file is an image
                <img
                  src={filePreview}
                  alt="Uploaded file"
                  className="max-h-64 object-contain mb-4"
                />
              ) : (
                // Show file name for non-image files
                <p className="text-gray-600">{file.name}</p>
              )}

              {/* Remove File Button */}
              <button
                onClick={handleRemoveFile}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Remove File
              </button>
            </div>
          )}
        </div>

        {/* Right Section - Form */}
        <div className="flex-1">
          {/* Anonymous Toggle */}
          {/* <div className="mb-4">
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="form-checkbox" />
              <div className="text-sm">Submit Anonymously</div>
            </label>
          </div> */}

          {/* Title Field */}
          <div className="mb-4">
            <Label htmlFor="title" className="text-lg font-semibold">
              Title
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Example: Moore's Law and Semiconductors"
            />
            <div className="block text-sm">
              This will be the public display name of your note
            </div>
          </div>

          {/* Class Code Field */}
          <div className="mb-4">
            <Label htmlFor="class-code" className="text-lg font-semibold">
              Class Code
            </Label>
            <Input
              id="class-code"
              type="text"
              placeholder="Example: CSEN 174"
            />
          </div>

          {/* Quarter Section with Two Dropdowns Side by Side */}
          <div className="mb-4">
            <div className="text-lg font-semibold">Quarter</div>
            <div className="flex space-x-4">
              {/* Season Dropdown */}
              {/* <select className="w-1/2 border border-gray-300 p-2 mt-1 rounded-md">
                <option>Fall</option>
                <option>Winter</option>
                <option>Spring</option>
                <option>Summer</option>
              </select> */}
              <Select onValueChange={handleChangeQuarter} defaultValue="Fall">
                <SelectTrigger className="w-1/2 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Fall">Fall</SelectItem>
                    <SelectItem value="Winter">Winter</SelectItem>
                    <SelectItem value="Spring">Spring</SelectItem>
                    <SelectItem value="Summer">Summer</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* Year Dropdown */}
              {/* <select className="w-1/2 border border-gray-300 p-2 mt-1 rounded-md">
                <option>2024</option>
                <option>2023</option>
                <option>2022</option>
                <option>2021</option>
              </select> */}
              <Select onValueChange={handleChangeYear} defaultValue="2024">
                <SelectTrigger className="w-1/2 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                    <SelectItem value="2020">2020</SelectItem>
                    <SelectItem value="2019">2019</SelectItem>
                    {/* You can add more years dynamically if needed */}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Extra Information */}
          <div className="mb-4">
            <Label htmlFor="extra-info" className="text-lg font-semibold">
              Extra Information
            </Label>
            <Textarea
              id="extra-info"
              placeholder="Add any extra information here..."
            />
            <div className="block text-sm">
              Please provide extra context to help with search, summary
              generation, and practice test generation
            </div>
          </div>

          {/* Submit and Cancel Buttons // DEFINITELY NEEDS CHANGING*/}
          <div className="flex space-x-4">
            <Link href="/home">
              <Button>Submit</Button>
            </Link>
            <Link href="/home">
              <Button variant={"outline"}>Cancel</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitNotes;
