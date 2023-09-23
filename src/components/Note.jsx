import { useEffect, useState } from "react";
import { FaBell, FaCheckCircle, FaCopy, FaDotCircle, FaTrash } from "react-icons/fa";
import { deleteNote, duplicateNote, updateNote } from "../services/notes.services";
import LabelBadge from "./LabelBadge";
import { activeNote, slectedNotes } from "../stores/Atoms";
import { useAtom } from "jotai";
import { getLabelsArray } from "../services/labels.services";
import { BiPin } from "react-icons/bi";
import useLongPress from "../hooks/useLongPress";

const LabelsBar = ({ labels }) => {
  const [_labels_, set_Labels_] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const _labels = await getLabelsArray(labels);
      set_Labels_(_labels);
    };

    fetchData();
  }, [labels]);
  if (!labels) return null;
  if (labels.length <= 3)
    return (
      <div className="flex gap-2">
        {_labels_.map((label) => (
          <LabelBadge key={label.id} label={label} />
        ))}
      </div>
    );
  const labelsToRender = _labels_.slice(0, 2);
  return (
    <div className="flex gap-2">
      {labelsToRender.map((label) => (
        <LabelBadge key={label} label={label} />
      ))}
      <LabelBadge label={`+${labels.length - 2}`} />
    </div>
  );
};

const Note = ({ note }) => {
  const [isHoverd, setIsHoverd] = useState(false);
  const [_activeNote, setActiveNote] = useAtom(activeNote);
  const [selected, setSelected] = useAtom(slectedNotes);
  const longpressRef = useLongPress(() => onSelected());
  const [isSelected, setIsSelected] = useState(false);
  const onSelected = () => {
    if (selected.some((i) => i === note.id)) return;
    setSelected([...selected, note.id]);
  };

  const onUnSelect = () => {
    const newArray = selected.filter(i=>i !== note.id)
    setSelected(newArray);
  };

  const handleNoteSelect = () => {
    setActiveNote(note.id);
  };

  useEffect(() => {
    if (selected.some((i) => i === note.id)) setIsSelected(true);
    else setIsSelected(false)
  }, [selected]);

  return (
    <div
      key={note.id}
      ref={longpressRef}
      className={`card justify-between`}
      onMouseEnter={() => setIsHoverd(true)}
      onMouseLeave={() => setIsHoverd(false)}
    >
      {isSelected || isHoverd ? (
        <div className={`absolute -mt-5 -ml-5`}>
          <FaCheckCircle
            className="bg-transparent"
            size={24}
            onClick={!isSelected ? () => onSelected() : () => onUnSelect()}
          />
        </div>
      ) : null}
      <div>
        <div className={`flex justify-between items-center `}>
          <h3 onClick={() => handleNoteSelect()} className="note-title">
            {note.title}
          </h3>
          {note.pinned ? (
            <BiPin
              size={24}
              onClick={() => updateNote(note.id, { pinned: false })}
            />
          ) : (
            <div
              className={`flex ${isHoverd ? "" : "invisible"}`}
              onClick={() => updateNote(note.id, { pinned: true })}
            >
              <BiPin size={24} />
            </div>
          )}
        </div>
        <div
          onClick={() => handleNoteSelect()}
          className=" cursor-pointer max-w-full overflow-hidden truncate rendered-html-output"
          dangerouslySetInnerHTML={{ __html: note.content }}
        ></div>
      </div>
      <br />
      <LabelsBar labels={note.labels} />
      <div className={`mt-2 flex gap-2 ${isHoverd ? "" : "invisible"} transition`}>
        <FaTrash onClick={() => deleteNote(note.id)} />
        <FaCopy onClick={() => duplicateNote(note.id)} />
      </div>
    </div>
  );
};

export default Note;
