import { useLiveQuery } from "dexie-react-hooks";
import React, { useEffect, useState } from "react";
import { db } from "../../config/DBConfig";
import TextEditor from "./TextEditor";
import { FaCopy, FaPlus } from "react-icons/fa";
import { updateNote } from "../../services/notes.services";

function stripHTML(input) {
  // Remove HTML tags using a regular expression
  const strippedString = input.replace(/<[^>]*>/g, "");

  // Replace HTML line breaks with newline characters
  const stringWithNewlines = strippedString.replace(/<br\s*[/]?>/gi, "\n");

  // Replace list tags with proper formatting
  const stringWithLists = stringWithNewlines
    .replace(/<ul>/gi, "\n")
    .replace(/<\/ul>/gi, "")
    .replace(/<ol>/gi, "\n")
    .replace(/<\/ol>/gi, "")
    .replace(/<li>/gi, "  • ")
    .replace(/<\/li>/gi, "\n");

  return stringWithLists;
}

const PromptWindow = ({ note, onClose }) => {
  const prompts = useLiveQuery(() => db.prompts.toArray());
  const [selectedPrompt, setSelectedPrompt] = useState();
  const [copyText, setCopyText] = useState();
  const [response, setResponse] = useState();

  async function copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }

  // onClick handler function for the copy button
  const handleCopyClick = (text) => {
    copyTextToClipboard(stripHTML(copyText))
      .then(() => {
        alert("Copied");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const injectContent = (prompt) => {
    let str = `
        ${prompt.text}

        ${note.content}
    `;
    return str;
  };

  const onPromptSelect = (promptId) => {
    console.log("promptId:", typeof promptId);
    db.prompts.get(Number(promptId)).then((data) => {
      console.log("data:", data);
      setSelectedPrompt(data);
      setCopyText(() => injectContent(data));
    });
  };

  const onReplaceContent = () => {
    updateNote(note.id, { content: response });
  };

  const onInsertContent = () => {
    const str = `
        ${note.content}

        ${response}
    `;
    updateNote(note.id, { content: str });
  };

  useEffect(() => {
    console.log(selectedPrompt);
  }, [selectedPrompt]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-20 bg-black bg-opacity-50`}
    >
      <div className={`w-[580px] rounded-xl `}>
        <div className="p-4  flex flex-col gap-3">
          <FaPlus className="rotate-45" size={24} onClick={onClose} />
          <h3 className="">What Would You like to Do ... </h3>
          <div className="">
            {prompts && (
              <select
                className="border-b-2 w-full"
                onChange={(e) => onPromptSelect(e.target.value)}
              >
                {prompts.map((prompt) => (
                  <option key={prompt.id} value={prompt.id}>
                    {prompt.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="flex  justify-between items-center">
            <h4>Prompt</h4>
            <FaCopy onClick={() => handleCopyClick()} />
          </div>
          {selectedPrompt && (
            <div
              className="rendered-html-output2"
              dangerouslySetInnerHTML={{ __html: copyText }}
            ></div>
          )}
          <h4 className="">Response</h4>
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            className="w-full min-h-[180px] border"
            placeholder="Past Response Here"
          />
        </div>
        <div className="flex justify-between items-center border-t-2 p-2">
          <div className="flex gap-2">
            <button className="border-2 py-1 px-2">Save To Note</button>
            <button
              onClick={() => onReplaceContent()}
              className="border-2 py-1 px-2"
            >
              Replace
            </button>
            <button
              onClick={() => onInsertContent()}
              className="border-2 py-1 px-2"
            >
              Insert
            </button>
          </div>
          <button className="border-2 py-1 px-2">Fromat</button>
        </div>
      </div>
    </div>
  );
};

export default PromptWindow;
