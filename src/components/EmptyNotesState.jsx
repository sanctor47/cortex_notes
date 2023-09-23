import React from "react";
import { FaPlus } from "react-icons/fa";
import { addNote } from "../services/notes.services";

const EmptyNotesState = () => {
  return (
    <div className="flex flex-col  items-center justify-center h-[90dvh] overflow-hidden">
      <div className="flex flex-col gap-3">
        <h1>No Notes Add A note</h1>
        <button
          onClick={() => addNote()}
          className="flex justify-center items-center gap-2 border-2 m-auto px-3 py-1 bg-theme-primary"
        >
          Add Note <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default EmptyNotesState;
