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
import { db, storage, auth } from "@/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import Tesseract from "tesseract.js"; 
import { OpenAI } from "openai"; 

const userId = "UID123"; 

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

  const [title, setTitle] = useState("");
  const [classCode, setClassCode] = useState("");
  const [quarter, setQuarter] = useState("Fall");
  const [year, setYear] = useState("2024");
  const [extraInfo, setExtraInfo] = useState("");
  const [ocrText, setOcrText] = useState<string>(""); // Store OCR text

  const acceptedFileTypes = ["application/pdf", "image/jpeg", "image/png"];

  // OpenAI configuration
  const client = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

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

  const performOCR = async (image: File) => {
    try {
      const result = await Tesseract.recognize(image, "eng", {
        logger: (m) => console.log(m), // Log OCR progress
      });
      setOcrText(result.data.text); // Store the extracted text
      return result.data.text;
    } catch (error) {
      console.error("OCR Error:", error);
      return "";
    }
  };

  const generateSummary = async (title: string, description: string, ocr: string) => {
    try {
      const prompt = `
        Title: ${title}
        Class Code: ${classCode}
        Quarter: ${quarter} ${year}
        Description: ${description}
        OCR Text: ${ocr}

        Please generate a brief summary of the above content.
      `;

      const response = await client.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4",
        max_tokens: 150,
      });

      return response.choices[0]?.message?.content || "No summary available.";
    } catch (error) {
      console.error("OpenAI Error:", error);
      return "Failed to generate summary.";
    }
  };

  const handleSubmit = async () => {
    if (!file || !title || !classCode) {
      setErrorMessage("Please fill all required fields and upload a file.");
      return;
    }

    try {
      const storageRef = ref(storage, `notes/${file.name}`);
      await uploadBytes(storageRef, file);
      const fileURL = await getDownloadURL(storageRef);

      let extractedText = "";
      if (file.type.startsWith("image/")) {
        extractedText = await performOCR(file);
      }

      const summary = await generateSummary(title, extraInfo, extractedText);

      const noteData = {
        note_id: `${Date.now()}`,
        user_id: userId,
        course_id: classCode,
        title,
        description: extraInfo,
        quarter,
        year,
        upload_date: new Date().toISOString(),
        file_url: fileURL,
        ocr_text: extractedText,
        summary,
        tags: [],
        views: 0,
        rating: 0,
      };

      const docRef = await addDoc(collection(db, "notes"), noteData);
      console.log("Note uploaded with ID: ", docRef.id);
      alert("File uploaded and summary generated successfully!");
    } catch (error) {
      console.error("Error uploading file or saving data:", error);
      setErrorMessage("Failed to upload and save data.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="text-6xl font-bold mb-8">Upload Notes</div>
      <div className="flex flex-col md:flex-row space-y-8 md:space-x-8">
        <div className="h-[550px] aspect-[17/22] mx-auto">
          {!file ? (
            <div
              className="border border-dashed p-8 h-full flex flex-col items-center justify-center rounded-lg"
              onDrop={handleDropFile}
              onDragOver={(event) => event.preventDefault()}
            >
              <Label htmlFor="file-upload" className="cursor-pointer">
                <FilePlus2 size={32} />
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </Label>
              <div className="text-3xl font-bold">Upload Files</div>
              <div>or drag and drop files here</div>
              {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
            </div>
          ) : (
            <div className="border p-8 flex flex-col items-center justify-center rounded-lg">
              {filePreview ? (
                <img
                  src={filePreview}
                  alt="Uploaded Preview"
                  className="max-h-64 object-contain mb-4"
                />
              ) : (
                <p>{file.name}</p>
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
          <Label htmlFor="title" className="text-lg font-semibold">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter note title"
          />

          <Label htmlFor="class-code" className="text-lg font-semibold">Class Code</Label>
          <Input
            id="class-code"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
            placeholder="Enter class code"
          />

          <div className="flex space-x-4 mt-4">
            <Select onValueChange={setQuarter} defaultValue="Fall">
              <SelectTrigger className="w-1/2">
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
              <SelectTrigger className="w-1/2">
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

          <Label htmlFor="extra-info" className="text-lg font-semibold">Extra Information</Label>
          <Textarea
            id="extra-info"
            value={extraInfo}
            onChange={(e) => setExtraInfo(e.target.value)}
            placeholder="Any extra information..."
          />

          <div className="flex space-x-4 mt-4">
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
