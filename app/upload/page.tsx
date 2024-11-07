"use client";

import { useEffect, useState } from "react";
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
import { auth, db, storage } from "@/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import Tesseract from "tesseract.js";
import { OpenAI } from "openai";
import { classCodes } from "@/lib/constants";

const userId = "UID123";

const SubmitNotes = () => {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const [user, setUser] = useState<User | string | null>(
    "I am not null, idiot >:("
  );
  const [title, setTitle] = useState("");
  const [classCodeDepartment, setClassCodeDepartment] = useState("");
  const [classCodeNumber, setClassCodeNumber] = useState("");
  const [quarter, setQuarter] = useState("Fall");
  const [year, setYear] = useState("2024");
  const [extraInfo, setExtraInfo] = useState("");
  const [ocrText, setOcrText] = useState<string>("");

  const acceptedFileTypes = ["application/pdf", "image/jpeg", "image/png"];

  // Check user is logged in
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

  const performOCR = async (image: File) => {
    try {
      const result = await Tesseract.recognize(image, "eng", {
        logger: (m) => console.log(m),
      });
      setOcrText(result.data.text);
      return result.data.text;
    } catch (error) {
      console.error("OCR Error:", error);
      return "";
    }
  };

  const generateSummary = async (
    title: string,
    description: string,
    ocr: string
  ) => {
    try {
      const prompt = `
        Title: ${title}
        Class Code: ${classCodeDepartment} ${classCodeNumber}
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
    // Because user state starts off as a string
    if (typeof user === "string") return;
    if (!file || !title || !classCodeDepartment || !classCodeNumber) {
      setErrorMessage("Please fill all required fields and upload a file.");
      return;
    }

    try {
      // Step 1: Check if the course exists in Firestore
      let courseName = `${classCodeDepartment} ${classCodeNumber}`;
      const courseQuery = query(
        collection(db, "courses"),
        where("course_name", "==", courseName),
        where("quarter", "==", `${quarter} ${year}`)
      );
      const courseSnapshot = await getDocs(courseQuery);
      let courseId;

      if (courseSnapshot.empty) {
        // Step 2: Add new course to Firestore if it doesn't exist
        const newCourse = {
          course_name: courseName,
          department: "Engineering", // Update department as needed
          professor: "TBD", // Update professor if known
          quarter: `${quarter} ${year}`,
          description: extraInfo,
          note_count: 1,
        };

        const courseRef = await addDoc(collection(db, "courses"), newCourse);
        courseId = courseRef.id;
        console.log("New course added with ID:", courseRef.id);
      } else {
        courseId = courseSnapshot.docs[0].id;
      }

      // Step 3: Proceed with uploading the note
      const storageRef = ref(storage, `notes/${file.name}`);
      await uploadBytes(storageRef, file);
      const fileURL = await getDownloadURL(storageRef);

      let extractedText = "";
      if (file.type.startsWith("image/")) {
        extractedText = await performOCR(file);
      }

      const summary = await generateSummary(title, extraInfo, extractedText);

      const noteData = {
        user_id: user.uid,
        course_id: courseId,
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
        saves: 0,
        downloads: 0,
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
    typeof user !== "string" && (
      <div className="container mx-auto h-[calc(100vh-64px)] p-8 sm:p-16">
        <div className="text-6xl font-bold mb-8">Upload Notes</div>
        <div className="flex flex-col md:flex-row space-y-8 md:space-x-8">
          <div className="h-[550px] aspect-[17/22] mx-auto">
            {!file ? (
              <div
                className="border border-dashed p-8 h-full flex flex-col items-center justify-center rounded-lg"
                onDrop={(e) => {
                  e.preventDefault();
                  handleFileChange(
                    e as unknown as React.ChangeEvent<HTMLInputElement>
                  );
                }}
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
                {errorMessage && (
                  <p className="text-red-500 mt-2">{errorMessage}</p>
                )}
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
                  onClick={() => {
                    setFile(null);
                    setFilePreview(null);
                  }}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Remove File
                </button>
              </div>
            )}
          </div>

          <div className="flex-1">
            <Label htmlFor="title" className="text-lg font-semibold">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title"
              className="mb-2"
            />

            <div className="text-lg font-semibold">Class Code</div>
            <div className="flex space-x-4 mb-2">
              <Select
                onValueChange={setClassCodeDepartment}
                defaultValue="ACTG"
              >
                <SelectTrigger className="w-1/2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {classCodes.map((value, index) => (
                      <SelectItem key={index} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Input
                id="class-code-number"
                type="number"
                value={classCodeNumber}
                onChange={(e) => setClassCodeNumber(e.target.value)}
                min={1}
                max={999}
                className="w-1/2"
              />
            </div>

            <div className="text-lg font-semibold">Quarter</div>
            <div className="flex space-x-4 mb-2">
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
                    <SelectItem value="2023">2022</SelectItem>
                    <SelectItem value="2023">2021</SelectItem>
                    <SelectItem value="2023">2020</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Label htmlFor="extra-info" className="text-lg font-semibold">
              Extra Information
            </Label>
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
    )
  );
};

export default SubmitNotes;
