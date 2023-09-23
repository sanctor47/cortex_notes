import { useLiveQuery } from "dexie-react-hooks";
import MasonryGrid from "./components/MasonryGrid";
import Note from "./components/Note";
import { db } from "./config/DBConfig";
import EmptyNotesState from "./components/EmptyNotesState";
import Toolbar from "./components/Toolbar";
import NoteEditor from "./components/NoteEditor";
import { useAtom } from "jotai";
import {
  activeNote,
  labelFilter,
  labeslMangerOpen,
  notesSearchTermAtom,
  scrollLockAtom,
  themeAtom,
} from "./stores/Atoms";
import SideDrawer from "./components/Atoms/SideDrawer";
import LabelsManger from "./components/LabelsManger";
import { useMemo, useState } from "react";
import PromptManger from "./components/PromptManger";

function App() {
  const [filter] = useAtom(labelFilter);
  const [searchTerm] = useAtom(notesSearchTermAtom);
  const [theme] = useAtom(themeAtom);
  const [promptMangerIsOpen, setPromptMangerIsOpen] = useState(false);
  const [_activeNote] = useAtom(activeNote);
  const [labelMangerIsOpen] = useAtom(labeslMangerOpen);
  const [scrollLock] = useAtom(scrollLockAtom);

  const notes = useLiveQuery(() => {
    return db.notes
      .reverse()
      .toArray()
      .then((allNotes) => {
        let filteredNotes = allNotes;

        // Filter by labels if filter is provided
        if (filter) {
          filteredNotes = filteredNotes.filter((note) =>
            note.labels.includes(filter)
          );
        }

        // Search through filtered notes if searchTerm is provided
        if (searchTerm) {
          filteredNotes = filteredNotes.filter((note) =>
            note.title.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        return filteredNotes;
      });
  }, [filter, searchTerm]);

  const pNote = useMemo(() => {
    if (!notes) return [];
    return notes.filter((note) => note.pinned === true);
  }, [notes]);

  const oNote = useMemo(() => {
    if (!notes) return [];
    return notes.filter((note) => note.pinned === false);
  }, [notes]);

  if (!notes) return null;
  return (
    <div
      className={`${
        theme ? "" : "darkTheme"
      }   sm:px-24 flex flex-col sm:items-center gap-2 h-full min-h-screen bg-theme-background`}
    >
      <Toolbar setPromptMangerIsOpen={setPromptMangerIsOpen} />
      {notes?.length === 0 ? (
        <EmptyNotesState />
      ) : (
        <div className="sm:w-full w-[98%]">
          {pNote.length > 0 && (
            <>
              <h2>Pinned</h2>
              <MasonryGrid>
                {pNote.map((note) => (
                  <Note note={note} key={note.id} />
                ))}
              </MasonryGrid>
              <h2>Others</h2>
            </>
          )}
          <MasonryGrid>
            {oNote.map((note) => (
              <Note note={note} key={note.id} />
            ))}
          </MasonryGrid>
        </div>
      )}
      {_activeNote && <NoteEditor />}
      {promptMangerIsOpen && (
        <PromptManger setPromptMangerIsOpen={setPromptMangerIsOpen} />
      )}
      <SideDrawer isOpen={labelMangerIsOpen}>
        <LabelsManger />
      </SideDrawer>
    </div>
  );
}

export default App;
