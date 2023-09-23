import React, { useState } from "react";

const EditInPlace = ({ value, onChange, size, w }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    // Save the edited value
    onChange(editedValue);
  };

  const handleChange = (e) => {
    setEditedValue((prev) => e.target.value);
  };

  const renderContent = () => {
    switch (size) {
      case "h1":
        return <h1>{value}</h1>;
      case "h2":
        return <h2>{value}</h2>;
      case "h3":
        return <h3>{value}</h3>;
      case "h4":
        return <h4>{value}</h4>;
      case "p":
        return <p>{value}</p>;
      default:
        return <p>{value}</p>;
    }
  };

  const textSize = {
    h1: "text-3xl",
    h2: "text-2xl",
    h3: "text-1xl",
    h4: "text-lg",
  };

  return (
    <div className={`${w ? "w-full" : ""} `} onDoubleClick={handleDoubleClick}>
      {isEditing ? (
        <input
          type="text"
          value={editedValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`bg-transparent ${textSize[size]} ${
            w ? "w-full" : ""
          } outline-none ring-1`}
          autoFocus
        />
      ) : (
        renderContent()
      )}
    </div>
  );
};

export default EditInPlace;
