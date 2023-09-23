import { useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // ES6

var toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  [{ list: "ordered" }, { list: "bullet" }],
  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  ["clean"], // remove formatting button
];

const TextEditor = ({ value, onChange }) => {
  const quillRef = useRef(null);
  const [content, setContent] = useState(value || "Take A Note");
  const handleChange = (e) => {
    onChange(e);
    setContent(e);
  };
  return (
    <ReactQuill
      className="quill-con"
      ref={quillRef}
      value={content}
      theme="snow"
      placeholder="Take a Note ..."
      onChange={(e) => handleChange(e)}
      modules={{
        toolbar: toolbarOptions,
      }}
    />
  );
};

export default TextEditor;
