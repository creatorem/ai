import * as React from "react";

type PossibleRef<T> = React.Ref<T> | undefined;

/**
 * Assigns a value to a ref, whether it's a callback ref or object ref.
 */
function setRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref != null) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

/**
 * Composes multiple refs into a single callback ref.
 */
export function useComposedRefs<T>(
  ...refs: PossibleRef<T>[]
): React.RefCallback<T> {
  return React.useCallback((node: T) => {
    for (const ref of refs) {
      setRef(ref, node);
    }
  }, refs);
}
