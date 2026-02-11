type EventHandler<E extends { defaultPrevented: boolean }> = (event: E) => void;

/**
 * Composes two event handlers.
 * The second handler will only run if:
 *  - The first handler did NOT call event.preventDefault()
 *  - (unless checkForDefaultPrevented is false)
 */
export function composeEventHandlers<E extends { defaultPrevented: boolean }>(
  originalEventHandler?: EventHandler<E>,
  ourEventHandler?: EventHandler<E>,
  options: { checkForDefaultPrevented?: boolean } = {}
): EventHandler<E> {
  const { checkForDefaultPrevented = true } = options;

  return function handleEvent(event: E) {
    originalEventHandler?.(event);

    if (!checkForDefaultPrevented || !event.defaultPrevented) {
      ourEventHandler?.(event);
    }
  };
}
