import { toast } from 'react-toastify';
import UndoToast from '../components/ui/UndoToast.jsx';

export const notify = {
  success: (message) => toast.success(message, { autoClose: 2400 }),

  error: (message, options) => toast.error(message, { autoClose: 5000, ...options }),

  info: (message) => toast.info(message, { autoClose: 2400 }),

  undoable(message, onUndo, restoredMessage) {
    toast(
      ({ closeToast }) => (
        <UndoToast
          message={message}
          closeToast={closeToast}
          onUndo={() => {
            onUndo();
            if (restoredMessage) toast.success(restoredMessage, { autoClose: 2000 });
          }}
        />
      ),
      { autoClose: 6000, icon: false },
    );
  },
};
