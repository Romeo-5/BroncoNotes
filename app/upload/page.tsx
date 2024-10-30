"use client";
import React, { useState } from "react";
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
import { db, storage } from "@/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

// Replace with actual authenticated user's ID when available.
const userId = "UID123"; 

const SubmitNotes = () => {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [classCode, setClassCode] = useState("");
  const [quarter, setQuarter] = useState("Fall");
  const [year, setYear] = useState("2024");
  const [extraInfo, setExtraInfo] = useState("");

  const acceptedFileTypes = ["application/pdf", "image/jpeg", "image/png"];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      if (!acceptedFileTypes.includes(uploadedFile.type)) {
        setErrorMessage("Only PDF, JPG, and PNG files are allowed.");
        setFile(null);
        setFilePreview(null);
        return;
      }
      setErrorMessage(null);
      setFile(uploadedFile);

      if (uploadedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => setFilePreview(reader.result as string);
        reader.readAsDataURL(uploadedFile);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleDropFile = (e: React.DragEvent<HTMLInputElement>) => {
    e.preventDefault();
    handleFileChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
  };

  const handleSubmit = async () => {
    if (!file || !title || !classCode) {
      setErrorMessage("Please fill all required fields and upload a file.");
      return;
    }

    try {
      // Upload the file to Firebase Storage
      const storageRef = ref(storage, `notes/${file.name}`);
      await uploadBytes(storageRef, file);
      const fileURL = await getDownloadURL(storageRef);

      // Prepare the note data based on your schema
      const noteData = {
        note_id: `${Date.now()}`,  // Basic timestamp-based ID
        user_id: userId,
        course_id: classCode,
        title,
        description: extraInfo,
        upload_date: new Date().toISOString(),
        file_url: fileURL,
        tags: [],  // Add tags if needed later
        views: 0,
        rating: 0,
      };

      // Add the note to Firestore
      const docRef = await addDoc(collection(db, "notes"), noteData);
      console.log("Note uploaded with ID: ", docRef.id);
      alert("File uploaded and information saved successfully!");
    } catch (error) {
      console.error("Error uploading file or saving data:", error);
      setErrorMessage("Failed to upload and save data.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="text-6xl font-bold mb-8">Upload Notes</div>
      <div className="flex flex-col md:flex-row space-y-8 space-x-0 md:space-y-0 md:space-x-8">
        <div className="h-[550px] aspect-[17/22] mx-auto">
          {!file ? (
            <div
              className="border border-dashed p-8 h-[550px] flex flex-col items-center justify-center space-y-2 rounded-lg"
              onDrop={handleDropFile}
              onDragOver={(event) => event.preventDefault()}
            >
              <Label htmlFor="file-upload" className="cursor-pointer">
                <FilePlus2 className="size-32 text-border" />
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </Label>
              <div className="text-border font-bold text-3xl">Upload Files</div>
              <div className="text-border">or drag and drop files here</div>
              {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
            </div>
          ) : (
            <div className="border border-dashed p-8 h-[550px] flex flex-col items-center justify-center rounded-lg">
              {filePreview ? (
                <img
                  src={filePreview}
                  alt="Uploaded file"
                  className="max-h-64 object-contain mb-4"
                />
              ) : (
                <p className="text-gray-600">{file.name}</p>
              )}
              <button
                onClick={handleRemoveFile}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Remove File
              </button>
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="mb-4">
            <Label htmlFor="title" className="text-lg font-semibold">
              Title
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Example: Moore's Law and Semiconductors"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="class-code" className="text-lg font-semibold">
              Class Code
            </Label>
            <Input
              id="class-code"
              type="text"
              placeholder="Example: CSEN 174"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <div className="text-lg font-semibold">Quarter</div>
            <div className="flex space-x-4">
              <Select onValueChange={setQuarter} defaultValue="Fall">
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

              <Select onValueChange={setYear} defaultValue="2024">
                <SelectTrigger className="w-1/2 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-4">
            <Label htmlFor="extra-info" className="text-lg font-semibold">
              Extra Information
            </Label>
            <Textarea
              id="extra-info"
              placeholder="Add any extra information here..."
              value={extraInfo}
              onChange={(e) => setExtraInfo(e.target.value)}
            />
          </div>

          <div className="flex space-x-4">
            <Button onClick={handleSubmit}>Submit</Button>
            <Link href="/home">
              <Button variant="outline">Cancel</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitNotes;
