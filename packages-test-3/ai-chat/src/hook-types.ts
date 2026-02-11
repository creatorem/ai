
export interface AutoScrollConfig {
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

export interface AutoScrollResult {
  scrollToBottom: () => void;
  ref: (node: any) => void;
}

export interface RuntimeHooks {
  useAutoScroll: (config?: AutoScrollConfig) => AutoScrollResult;
  useMeasure: () => { ref: (node: any) => void; width: number; height: number };
  useHover: (callback: (isHovering: boolean) => void) => (node: any) => void;
}

