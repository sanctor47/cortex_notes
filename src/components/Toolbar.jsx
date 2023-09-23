import React from "react";
import { addNote, mergeNotes } from "../services/notes.services";
import {
  FaMagic,
  FaPlus,
  FaSun,
  FaTags,
  FaTrash,
  FaVoicemail,
} from "react-icons/fa";
import {
  activeNote,
  labeslMangerOpen,
  notesSearchTermAtom,
  slectedNotes,
  themeAtom,
} from "../stores/Atoms";
import { useAtom } from "jotai";
import { AiOutlineMergeCells } from "react-icons/ai";
const Toolbar = ({ setPromptMangerIsOpen }) => {
  const [labelMangerIsOpen, setLabelMangerIsOpen] = useAtom(labeslMangerOpen);
  const [_activeNote, setActiveNote] = useAtom(activeNote);
  const [selelcted, setSelected] = useAtom(slectedNotes);
  const [theme, setTheme] = useAtom(themeAtom);
  const [searchTerm, setSearchTerm] = useAtom(notesSearchTermAtom);

  const onAddNote = () => {
    const id = addNote();
    // setActiveNote(id);
  };

  const onMergeNotes = () => {
    mergeNotes(selelcted);
    setSelected([]);
  };
  return (
    <div className="flex z-20 gap-2 w-full border-2 p-2 justify-between bg-theme-background sticky top-0">
      <input
        type="text"
        placeholder="Search your notes"
        className="flex-1"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button
        onClick={() => setLabelMangerIsOpen(true)}
        className="flex justify-center items-center gap-2   p-2 bg-theme-primary"
      >
        <FaTags />
      </button>
      <button
        onClick={() => setPromptMangerIsOpen(true)}
        className="flex justify-center items-center gap-2   p-2 bg-theme-primary"
      >
        <FaMagic />
      </button>
      <button
        onClick={() => setTheme(!theme)}
        className="flex justify-center items-center gap-2   p-2 bg-theme-primary"
      >
        <FaSun />
      </button>
      <button
        onClick={() => onAddNote()}
        className="flex justify-center items-center gap-2   p-2 bg-theme-primary"
      >
        <FaPlus />
      </button>
      {selelcted && selelcted.length > 1 ? (
        <button
          onClick={() => onMergeNotes()}
          className="flex justify-center items-center gap-2   p-2 bg-theme-primary"
        >
          <AiOutlineMergeCells />
        </button>
      ) : null}
    </div>
  );
};

export default Toolbar;
