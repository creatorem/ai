import { RuntimeComponents } from "./component-types";

export interface AutoScrollConfig {
  /**
   * Controls scroll anchoring behavior for new messages.
   * - "bottom" (default): Messages anchor at the bottom, classic chat behavior.
   * - "top": New user messages anchor at the top of the viewport for a focused reading experience.
   */
  turnAnchor?: "top" | "bottom" | undefined;

  /**
   * Whether to automatically scroll to the bottom when new messages are added.
   * Default false if `turnAnchor` is "top", otherwise defaults to true.
   */
  autoScroll?: boolean | undefined;

  /**
   * Whether to scroll to bottom when a new run starts. Defaults to true.
   */
  scrollToBottomOnRunStart?: boolean | undefined;

  /**
   * Whether to scroll to bottom when thread history is first loaded. Defaults to true.
   */
  scrollToBottomOnInitialize?: boolean | undefined;

  /**
   * Whether to scroll to bottom when switching to a different thread. Defaults to true.
   */
  scrollToBottomOnThreadSwitch?: boolean | undefined;
}

export interface RuntimeHooks {
  useMessageRootRef: <T extends React.Ref<unknown>>(
    ref: T,
  ) => { ref: T } & React.ComponentPropsWithRef<RuntimeComponents["Box"]>;
}
