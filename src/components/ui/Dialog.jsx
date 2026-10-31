import { useEffect, useRef } from 'react';

export default function Dialog({ labelledBy, onClose, children }) {
  const dialogRef = useRef(null);
  const pressedOnBackdrop = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previouslyFocused = document.activeElement;
    if (!dialog.open) dialog.showModal();
    dialog.querySelector('[data-autofocus]')?.focus();

    return () => {
      if (dialog.open) dialog.close();
      if (previouslyFocused?.isConnected) previouslyFocused.focus({ preventScroll: true });
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={labelledBy}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onMouseDown={(event) => {
        pressedOnBackdrop.current = event.target === dialogRef.current;
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current && pressedOnBackdrop.current) onClose();
      }}
      className="lane-dialog mt-auto mb-0 mx-0 max-h-[92dvh] w-full max-w-full flex-col overflow-hidden rounded-t-xl border border-line bg-raised p-0 text-fg shadow-pop open:flex backdrop:bg-black/55 sm:m-auto sm:max-h-[min(44rem,calc(100dvh-3rem))] sm:max-w-[30rem] sm:rounded-xl"
    >
      {children}
    </dialog>
  );
}
