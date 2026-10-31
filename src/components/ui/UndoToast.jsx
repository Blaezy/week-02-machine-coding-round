export default function UndoToast({ message, onUndo, closeToast }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span>{message}</span>
      <button
        type="button"
        onClick={() => {
          onUndo();
          closeToast?.();
        }}
        className="rounded px-1.5 py-0.5 text-[13px] font-semibold text-accent transition-colors hover:bg-hover"
      >
        Undo
      </button>
    </div>
  );
}
