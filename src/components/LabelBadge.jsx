import React from "react";
import { getLabelById } from "../services/labels.services";

const LabelBadge = ({
  label,
  onDoubleClick = () => null,
  onClick = () => null,
}) => {
  if (!label) return null;
  return (
    <div
      onClick={() => onClick()}
      onDoubleClick={() => onDoubleClick(label.id)}
      className="border-2 p-1 flex justify-center items-center text-sm"
    >
      {label.text}
    </div>
  );
};

export default LabelBadge;
