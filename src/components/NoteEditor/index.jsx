import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { activeNote } from "../../stores/Atoms";
import { db } from "../../config/DBConfig";
import EditInPlace from "../Atoms/EditInPlace";
import {
  deleteNote,
  throtteledUpdate,
  updateNote,
} from "../../services/notes.services";
import { FaMagic, FaPlus, FaTrash } from "react-icons/fa";
import { BiMerge, BiPin } from "react-icons/bi";
import useClickOutside from "../../hooks/useClickOutSide";
import LabelBadge from "../LabelBadge";
import { getLabelsArray } from "../../services/labels.services";
import LabelsDropDown from "./LabelsDropDown";
import TextEditor from "./TextEditor";
import PromptWindow from "./PromptWindow";

const NoteEditor = () => {
  const [_activeNote, setActiveNote] = useAtom(activeNote);
  const [note, setNote] = useState();
  const [isPromptWindowOpen, setIsPromptWindowOpen] = useState(false);

  const onChange = (update) => {
    setNote((prev) => ({
      ...prev,
      ...update,
    }));
    throtteledUpdate(note.id, update);
  };

  const onPromptWindowClose = () => {
    setIsPromptWindowOpen(false);
  };

  const onLabelSelect = (label) => {
    const exists = note.labels.some((l) => l === label);
    if (exists) return;
    const newlabels = [...note.labels, label];
    onChange({ labels: newlabels });
  };

  const onLabelDelete = (labelToDelete) => {
    const newLabels = note.labels.filter((label) => label !== labelToDelete);
    onChange({ labels: newLabels });
  };

  useEffect(() => {
    db.notes.get(_activeNote).then((data) => setNote(data));
  }, [activeNote]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-20 bg-black bg-opacity-50`}
    >
      <div className={`min-w-[360px] sm:w-[580px] rounded-xl sm:h-auto h-[100dvh] `}>
        {note && (
          <div className="flex flex-col  gap-2 py-2 px-4">
            <div className={`flex justify-between items-center`}>
              <FaPlus
                size={24}
                className="rotate-45 mt-3"
                onClick={() => setActiveNote("")}
              />
              <div className="flex gap-4 justify-between items-center">
                {note.parents && note.parents.length > 0 && (
                  <BiMerge
                    size={24}
                    onClick={() => {
                      // setActiveNote(note.parents[0]);
                    }}
                  />
                )}
                <BiPin
                  size={24}
                  onClick={() => updateNote(note.id, { pinned: !note.pinned })}
                />
              </div>
            </div>
            <EditInPlace
              w={true}
              size={"h2"}
              value={note?.title}
              onChange={(e) => onChange({ title: e })}
            />

            <TextEditor
              className="w-full h-[320px]"
              value={note?.content}
              onChange={(e) => onChange({ content: e })}
            />
            <LabelsBar
              labels={note?.labels}
              onLabelSelect={onLabelSelect}
              onLabelDelete={onLabelDelete}
            />
            <div className={` flex gap-4 border-t-2 p-4`}>
              <FaTrash
                onClick={() => {
                  deleteNote(note.id);
                  setActiveNote("");
                }}
              />
              <FaMagic
                onClick={() => {
                  setIsPromptWindowOpen(true);
                }}
              />
            </div>
          </div>
        )}
      </div>
      {isPromptWindowOpen && (
        <PromptWindow note={note} onClose={onPromptWindowClose} />
      )}
    </div>
  );
};

export default NoteEditor;

const LabelsBar = ({ labels, onLabelSelect, onLabelDelete }) => {
  const [_labels_, set_Labels_] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const _labels = await getLabelsArray(labels);
      set_Labels_(_labels);
      // Now you can use _labels as your data.
    };

    fetchData();
  }, [labels, onLabelSelect]);
  return (
    <div className="flex gap-2 p-2">
      <LabelsDropDown onLabelSelect={onLabelSelect} />
      {_labels_?.map((label) => (
        <LabelBadge label={label} onDoubleClick={onLabelDelete} />
      ))}
    </div>
  );
};
