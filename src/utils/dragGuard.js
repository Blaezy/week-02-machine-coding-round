// A drag that ends over its own card would otherwise also fire a click and open the editor.
const CLICK_GUARD_MS = 250;
let lastDragEnd = 0;

export const markDragEnd = () => {
  lastDragEnd = performance.now();
};

export const wasJustDragged = () => performance.now() - lastDragEnd < CLICK_GUARD_MS;
