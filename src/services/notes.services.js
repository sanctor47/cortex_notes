import debounce from "lodash.debounce";
import { db } from "../config/DBConfig";

export const addNote = async () => {
  const id = await db.notes.add({
    title: "New Note",
    content: "Hello Word",
    labels: [],
    pinned: false,
    createdAt: Date.now(),
  });
  console.log("Note Added: ", id);
  return id;
};

export const deleteNote = async (noteId) => {
  const id = await db.notes.delete(noteId);
  return id;
};

export const updateNote = async (noteId, update) => {
  const id = await db.notes.update(noteId, update);
  return id;
};

export const throtteledUpdate = debounce((noteId, update) => {
  const id = updateNote(noteId, update);
  return id;
}, 300);

export const duplicateNote = async (noteId) => {
  const targetNote = await db.notes.get(noteId);
  const newNote = {
    title: `${targetNote.title} - Copy`,
    content: targetNote.content,
    labels: targetNote.labels,
    pinned: false,
    parents: [noteId],
    createdAt: Date.now(),
  };
  const id = db.notes.add(newNote);
  return id;
};

export const mergeNotes = async (noteIds) => {
  // Get the matching notes based on the provided noteIds
  const matchingNotes = await db.notes.where("id").anyOf(noteIds).toArray();

  // Initialize the merged note
  let mergedNote = {
    title: "",
    content: "",
    labels: [],
    pinned: false,
    parents: noteIds,
    createdAt: Date.now(),
  };

  // Find the first note with a title (if any) and set it as the merged note's title
  for (const note of matchingNotes) {
    if (noteIds.includes(note.id)) {
      if (note.title) {
        mergedNote.title = `${note.title} - Merged`;
        break; // Exit the loop after finding the first matching note with a title
      }
    }
  }

  // Initialize the merged content
  let mergedContent = "";

  // Iterate through the notes and merge their content
  for (const note of matchingNotes) {
    if (noteIds.includes(note.id)) {
      if (mergedContent) {
        mergedContent += "<br>";
      }
      if (note.title) {
        mergedContent += `<h2>${note.title}</h2>`;
      }
      mergedContent += note.content;
    }
  }

  // Set the merged content to the merged note
  mergedNote.content = mergedContent;

  // Add the merged note to the database
  const id = await db.notes.add(mergedNote);

  return id;
};
