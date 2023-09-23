import { useAtom } from "jotai";
import { openEditor } from "../../stores/Atoms";

const EditorModal = ({ children }) => {
  const [_openEditor] = useAtom(openEditor);
  const overlayClasses = _openEditor
    ? "fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
    : "hidden";
  const popupClasses = _openEditor
    ? ` min-w-[360px] w-[460px] bg-skin-accent px-8 py-6 rounded-xl`
    : "hidden";
  return (
    <div className={overlayClasses}>
      <div className={popupClasses}>{children}</div>
    </div>
  );
};

export default EditorModal;
