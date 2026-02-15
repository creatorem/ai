export function composeEventHandlers<Params extends unknown[]>(
  ...handlers: Array<((...params: Params) => void) | null | undefined>
): (...params: Params) => void {
  return function handleEvent(...params: Params) {
    for (const handler of handlers) {
      if (typeof handler === "function") {
        handler(...params);
      }
    }
  };
}
