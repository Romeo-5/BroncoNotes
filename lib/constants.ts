// Global constants common across components
// Examples: placeholder values, API endpoints, etc.

import { Class, Note } from "./types";
import { v4 as uuidv4 } from "uuid";

// Placeholder note data
export const exampleNotes: Note[] = [
  {
    note_id: uuidv4(),
    user_id: uuidv4(),
    course_id: uuidv4(),
    title: "Introduction to Machine Learning",
    uploaded_at: "2024-04-15T10:30:00.000Z",
    file_url:
      "https://firebasestorage.googleapis.com/v0/b/project-1234/o/notes/ml_intro.pdf",
    tags: ["machine learning", "ai", "lecture notes"],
    view_count: 12500,
    vote_count: 785,
    download_count: 1045,
  },
  {
    note_id: uuidv4(),
    user_id: uuidv4(),
    course_id: uuidv4(),
    title: "Data Structures and Algorithms",
    uploaded_at: "2024-03-20T09:15:00.000Z",
    file_url:
      "https://firebasestorage.googleapis.com/v0/b/project-1234/o/notes/dsa.pdf",
    tags: ["data structures", "algorithms", "cs101"],
    view_count: 9820,
    vote_count: 1452,
    download_count: 2525,
  },
  {
    note_id: uuidv4(),
    user_id: uuidv4(),
    course_id: uuidv4(),
    title: "Advanced Calculus Notes",
    uploaded_at: "2024-05-01T13:45:00.000Z",
    file_url:
      "https://firebasestorage.googleapis.com/v0/b/project-1234/o/notes/adv_calc.pdf",
    tags: ["calculus", "math", "problem sets"],
    view_count: 6750,
    vote_count: 568,
    download_count: 743,
  },
  {
    note_id: uuidv4(),
    user_id: uuidv4(),
    course_id: uuidv4(),
    title: "History of Ancient Civilizations",
    uploaded_at: "2024-02-10T11:00:00.000Z",
    file_url:
      "https://firebasestorage.googleapis.com/v0/b/project-1234/o/notes/ancient_history.pdf",
    tags: ["history", "ancient civilizations", "lecture notes"],
    view_count: 8300,
    vote_count: 134340,
    download_count: 1560,
  },
  {
    note_id: uuidv4(),
    user_id: uuidv4(),
    course_id: uuidv4(),
    title: "Introduction to Psychology",
    uploaded_at: "2024-03-28T15:30:00.000Z",
    file_url:
      "https://firebasestorage.googleapis.com/v0/b/project-1234/o/notes/psych101.pdf",
    tags: ["psychology", "cognitive science", "lecture notes"],
    view_count: 18450,
    vote_count: 2690,
    download_count: 3245,
  },
  {
    note_id: uuidv4(),
    user_id: uuidv4(),
    course_id: uuidv4(),
    title: "Physics - Quantum Mechanics",
    uploaded_at: "2024-04-10T14:00:00.000Z",
    file_url:
      "https://firebasestorage.googleapis.com/v0/b/project-1234/o/notes/quantum_physics.pdf",
    tags: ["physics", "quantum mechanics", "homework solutions"],
    view_count: 15230,
    vote_count: 1802,
    download_count: 2340,
  },
];

// Placeholder note data from Firestore, queried using param.id
export const exampleNote: Note = exampleNotes[0];

// Placeholder course data, queried from note.course_id
export const exampleClass: Class = {
  course_id: exampleNote.course_id,
  course_name: "Software Engineering",
  department: "CSEN",
  number: "174",
  quarter: "Fall 2024",
  professor: "Dr. Kai Lukoff",
  description: "Introductory programming concepts in Python",
  note_count: 50,
};
// Placeholder Lorem Ipsum text for AI-generated summary
export const exampleSummary = `Ipsam officiis et qui laborum placeat adipisci iste. Sed amet illum voluptatem sunt quibusdam. Assumenda nihil possimus qui aspernatur accusamus reprehenderit rem. Qui facere sed facere dignissimos.
  
Ut nam repellat quaerat. Repellendus harum sunt et reprehenderit. In nam impedit commodi. Asperiores velit cumque consequatur quasi sunt maxime deserunt. Necessitatibus unde ut autem quae numquam voluptates. Quos maiores ipsa neque libero.

Ad corporis quibusdam et eius quidem labore id. Autem architecto architecto temporibus hic aut nam voluptatem aut. Necessitatibus unde excepturi sed esse. Error id commodi facilis at. Id rem porro voluptatem est beatae sit at.

Enim similique suscipit iste mollitia qui impedit dolor. Cupiditate consequatur dolor et autem veritatis et non earum. Ut ut sequi ratione voluptatum id. Nesciunt harum ut dolores illum.`;
