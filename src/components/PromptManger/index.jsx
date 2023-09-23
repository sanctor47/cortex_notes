import { useLiveQuery } from "dexie-react-hooks";
import React, { useState } from "react";
import { db } from "../../config/DBConfig";
import { FaEdit, FaPlus, FaSave, FaTrash } from "react-icons/fa";
import TextEditor from "../NoteEditor/TextEditor";
import useClickOutside from "../../hooks/useClickOutSide";

const PromptManger = ({ setPromptMangerIsOpen }) => {
  const prompts = useLiveQuery(() => db.prompts.toArray());
  const [formOpen, setFormOpen] = useState(false);
  const [editPrompt, setEditPrompt] = useState();

  const onFormClose = () => {
    setEditPrompt(null);
    setFormOpen(false);
  };

  const onEdit = (prompt) => {
    setEditPrompt(prompt);
    setFormOpen(true);
  };

  const onDelete = async (id) => {
    await db.prompts.delete(id);
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-20 bg-black bg-opacity-50`}
    >
      <div className={`w-[460px] rounded-xl p-4 flex flex-col gap-2`}>
        <FaPlus
        size={24}
          className="rotate-45"
          onClick={() => setPromptMangerIsOpen(false)}
        />
        <div className="flex justify-between gap-6">
          <h1>Prompt Manger</h1>
          <button
            onClick={() => setFormOpen(true)}
            className="flex gap-2 justify-center items-center px-2"
          >
            <FaPlus />
          </button>
        </div>
        <div />
        {prompts && prompts.length > 0 ? (
          <div className="flex flex-col gap-3">
            {prompts.map((pormpt) => (
              <PromptItem prompt={pormpt} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center flex-col p-4 gap-2">
            <h2>No Prompts</h2>
          </div>
        )}
      </div>
      {formOpen && (
        <PromptForm onClose={() => onFormClose()} prompt={editPrompt} />
      )}
    </div>
  );
};

export default PromptManger;

const PromptItem = ({ prompt, onEdit, onDelete }) => {
  return (
    <div className="flex justify-between items-center border-b-2">
      <div className="flex gap-4">
        <h4>{prompt.name}</h4>
        <p>
          <i>{prompt.type}</i>
        </p>
      </div>
      <div className="flex gap-2">
        <FaEdit onClick={() => onEdit(prompt)} />
        <FaTrash onClick={() => onDelete(prompt.id)} />
      </div>
    </div>
  );
};

const promptTypes = ["onShot", "Formating"];

const PromptForm = ({ onClose, prompt }) => {
  const [isEdit, setIsEdit] = useState(prompt ? true : false);
  const [promptData, setPromptData] = useState(
    isEdit
      ? prompt
      : {
          name: "",
          text: "",
          type: "onShot",
        }
  );
  const addPropmt = async (data) => {
    const id = db.prompts.add(promptData);
  };

  const updatePropmt = async (promptId, data) => {
    const id = db.prompts.update(prompt.id, promptData);
  };

  const handleSubmit = () => {
    if (isEdit) {
      updatePropmt();
    } else {
      addPropmt();
    }
    onClose();
  };
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-20 bg-black bg-opacity-50`}
    >
      <div className={`w-[580px] rounded-xl p-4`}>
        <div className="flex flex-col gap-4">
          <FaPlus className="rotate-45" size={24} onClick={() => onClose()} />
          <h2>{isEdit ? "Edit Prompt" : "New Prompt"}</h2>
          <input
            type="text"
            name="name"
            placeholder="Name..."
            className="border-b-2"
            value={promptData.name}
            onChange={(e) =>
              setPromptData((prev) => ({
                ...prev,
                ...{ name: e.target.value },
              }))
            }
          />
          <div className="flex justify-between">
            <label className="flex-1" htmlFor="type">
              Type:{" "}
            </label>
            <select
              name="type"
              className="border-b-2 flex-1"
              value={promptData.type}
              onChange={(e) =>
                setPromptData((prev) => ({
                  ...prev,
                  ...{ type: e.target.value },
                }))
              }
            >
              {promptTypes.map((type) => (
                <option value={type} key={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <TextEditor
            value={promptData.text}
            onChange={(e) =>
              setPromptData((prev) => ({ ...prev, ...{ text: e } }))
            }
          />
        </div>
        <button
          onClick={() => handleSubmit()}
          className="flex gap-2 justify-center items-center border-2 px-3 py-1"
        >
          {isEdit ? "Save" : "Add"} <FaSave />
        </button>
      </div>
    </div>
  );
};
