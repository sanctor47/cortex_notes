import React, { useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { db } from "../../config/DBConfig";
import { useLiveQuery } from "dexie-react-hooks";
import { useAtom } from "jotai";
import { labelFilter, labeslMangerOpen } from "../../stores/Atoms";
import { addLabel, deleteLabel } from "../../services/labels.services";

const LabelsManger = () => {
  const [searchText, setSearchText] = useState("");

  const labels = useLiveQuery(() => db.labels.toArray());
  const [labelMangerIsOpen, setLabelMangerIsOpen] = useAtom(labeslMangerOpen);
  const [filter, setFilter] = useAtom(labelFilter);
 

  const handleCreateOption = () => {
    if (searchText.trim() !== "") {
      addLabel(searchText);
      setSearchText("");
    }
  };

  const filteredLabels = labels?.filter((label) =>
    label.text.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <FaPlus
        className="rotate-45"
        size={24}
        onClick={() => setLabelMangerIsOpen(false)}
      />
      <h2>Labels</h2>
      {filter && <button onClick={() => setFilter("")}>Clear</button>}
      <div className=" mt-2 overflow-y-scroll">
        <div className="flex  items-center px-4 border-b">
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 py-2 outline-none"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <div
            style={{
              borderTopRightRadius: "0.375rem",
              borderBottomRightRadius: "0.375rem",
            }}
            className="flex justify-center items-center bg-shark-400  p-2 cursor-pointer"
            onClick={handleCreateOption}
          >
            <FaPlus />
          </div>
        </div>
        {!labels ? (
          <h2>No Labels</h2>
        ) : (
          <>
            {filteredLabels.map((label) => (
              <LabelItem
                key={label.id}
                label={label}
                filter={filter}
                setFilter={setFilter}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

const LabelItem = ({ label, filter, setFilter }) => {
  return (
    <div
      key={label.id}
      className={`flex justify-between items-center ${
        filter === label.id ? "border-2" : null
      }`}
    >
      <div
        onClick={() => setFilter(label.id)}
        className="cursor-pointer px-4 py-2 "
      >
        {label.text}
      </div>
      <div className="flex justify-end items-center">
        <div className="flex p-2">
          <FaEdit />
        </div>
        <div className="flex p-2" onClick={() => deleteLabel(label.id)}>
          <FaTrash />
        </div>
      </div>
    </div>
  );
};

export default LabelsManger;
