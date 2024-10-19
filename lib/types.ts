// Global types common across components

// Object structure of note data queried from Firestore
export interface Note {
  note_id: string; // UID of the note
  user_id: string; // UID of the user who created the note
  course_id: string; // UID of the course+quarter these notes are for
  title: string; // Public title of note
  uploaded_at: string; // ISO date-time notes were uploaded
  file_url: string; // Link to PDF or image files stored in Firebase
  tags: Array<string>; // List of tags user has added to this note
  view_count: number; // How many times this note has been uniquely viewed
  vote_count: number; // Sum of positive and negative votes
  download_count: number; // How many times note has been stored in a user's library, or downloaded?
}

// Object structure of class information
export interface Class {
  course_id: string;
  course_name: string;
  department: string;
  number: string;
  quarter: string;
  professor: string;
  description: string;
  note_count: number;
}
