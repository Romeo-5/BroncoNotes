"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Bookmark } from "lucide-react";
import { db } from "@/app/firebaseConfig"; // Import Firestore configuration
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  getDoc,
} from "firebase/firestore";

export default function SaveButton({
  noteId,
  userId,
}: {
  noteId: string;
  userId: string;
}) {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch initial saved state on component mount
  useEffect(() => {
    const fetchSavedStatus = async () => {
      if (!userId) return;

      try {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const savedNotes = userDoc.data().saved_notes || [];
          setIsSaved(savedNotes.includes(noteId));
        }
      } catch (error) {
        console.error("Error fetching saved status:", error);
      }
    };

    fetchSavedStatus();
  }, [userId, noteId]);

  const handleSaveToggle = async () => {
    if (!userId) return;

    setLoading(true);

    try {
      const noteRef = doc(db, "notes", noteId);
      const userRef = doc(db, "users", userId);

      if (isSaved) {
        // Remove note from saved_notes and decrement saves count
        await updateDoc(noteRef, { saves: increment(-1) });
        await updateDoc(userRef, { saved_notes: arrayRemove(noteId) });
      } else {
        // Add note to saved_notes and increment saves count
        await updateDoc(noteRef, { saves: increment(1) });
        await updateDoc(userRef, { saved_notes: arrayUnion(noteId) });
      }

      setIsSaved(!isSaved); // Toggle saved state
    } catch (error) {
      console.error("Error updating save status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleSaveToggle} disabled={loading}>
      <Bookmark className={`size-6 mr-2 ${isSaved ? "text-secondary" : ""}`} />
      <div className="whitespace-nowrap">{isSaved ? "Saved" : "Save"}</div>
    </Button>
  );
}
