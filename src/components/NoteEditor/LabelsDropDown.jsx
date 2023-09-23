import { FaPlus, FaTag } from "react-icons/fa";
import { useState } from "react";
import { db } from "../../config/DBConfig";
import { useLiveQuery } from "dexie-react-hooks";
import { addLabel } from "../../services/labels.services";
import { activeNote } from "../../stores/Atoms";
import { useAtom } from "jotai";

const LabelsDropDown = ({onLabelSelect}) => {
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [_activeNote, setActiveNote] = useAtom(activeNote);

  const labels = useLiveQuery(() => db.labels.toArray());
  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };
  const handleOptionSelect = (option) => {
    // setSelectedOption(option);
    onLabelSelect(option.id);
    setIsOpen(false);
  };
  const handleCreateOption = () => {
    if (searchText.trim() !== "") {
      addLabel(searchText);
      setSearchText("");
    }
  };
//   const filteredLabels = labels?.filter((label) =>
//     label.title.toLowerCase().includes(searchText.toLowerCase())
//   );

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={handleButtonClick}
        className="inline-flex border-2 items-center gap-2    cursor-pointer  justify-center w-full px-4 py-2 text-sm font-mediu"
      >
        Add Label
        <FaTag />
      </button>
      {isOpen && (
        <div className="z-40  origin-top-right absolute -right-30 -mt-12 w-56 max-h-48 overflow-y-scroll">
          <div className="py-1">
            <div className="flex items-center px-4 border-b bg-theme-background z-50 sticky top-0">
              <input
                type="text"
                placeholder="Search..."
                className="w-full py-2  bg-transparent focus:outline-none"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <div
                style={{
                  borderTopRightRadius: "0.375rem",
                  borderBottomRightRadius: "0.375rem",
                }}
                className="flex justify-center items-center   p-2 cursor-pointer"
                onClick={handleCreateOption}
              >
                <FaPlus />
              </div>
            </div>
            {labels.map((label) => (
              <div
                key={label.id}
                onClick={() => handleOptionSelect(label)}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100 hover:opacity-70"
              >
                {label.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LabelsDropDown;
