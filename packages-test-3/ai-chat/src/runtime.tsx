import React, { createContext, useContext, type ReactNode } from 'react';
import { RuntimeComponents } from './component-types';
import { RuntimeHooks, AutoScrollConfig, AutoScrollResult } from './hook-types';
export type { AutoScrollConfig, AutoScrollResult };

export type RuntimeFunctions = {
  copyToClipboard: (value:string, callback: () => void) => void
}

export interface RuntimeContextValue {
  components: RuntimeComponents;
  hooks: RuntimeHooks;
  fn: RuntimeFunctions;
}

const defaultComponents: RuntimeComponents = {
  Box: ({ children, ...props }) => <div {...props}>{children}</div>,
  Form: ({ children, ...props }) => <div {...props}>{children}</div>,
  Text: React.Fragment,
  Button: ({ children, variant, size, ...props }) => <button {...props}>{children}</button>,
  ScrollArea: ({ children, ...props }) => <div {...props} style={{ overflow: 'auto', ...props.style }}>{children}</div>,
  Input: ({onChange: onChangeProp, ...props}) => <textarea {...props} onChange={(e) => onChangeProp?.(e.target.value, e)} />,
  
  // Content Components
  Markdown: ({ content }) => <pre>{content}</pre>,
  CodeBlock: ({ value }) => <pre>{value}</pre>,
  Pre: ({ children }) => <pre>{children}</pre>,
  
  // Media Components
  Image: (props) => <img {...props} alt={props.alt || ''} />,
  Avatar: (props) => <img {...props} alt="Avatar" />,
  
  // Attachments
  ComposerPrimitiveAddAttachment: ({ children, variant, size, ...props }) => <button {...props}>{children}</button>,

  // Attachments
  Attachment: (props) => <div>{props.name}</div>,

  // Layout
  Separator: (props) => <hr {...props} />,
   
  // Logic/Wrappers
  MessageSpacer: ({ children }) => <>{children}</>,
 };

const defaultHooks: RuntimeHooks = {
  useAutoScroll: () => ({ scrollToBottom: () => {}, ref: () => {} }),
  useMeasure: () => ({ ref: () => {}, width: 0, height: 0 }),
  useMessageRootRef: (ref) => ref,
};

const defaultFunctions: RuntimeFunctions = {
  copyToClipboard: () => {},
};

const RuntimeContext = createContext<RuntimeContextValue>({
  components: defaultComponents,
  hooks: defaultHooks,
  fn: defaultFunctions,
});

export const RuntimeProvider = ({
  components,
  hooks,
  functions,
  children,
}: {
  components: RuntimeComponents;
  hooks: RuntimeHooks;
  functions: RuntimeFunctions;
  children: ReactNode;
}) => {
  return (
    <RuntimeContext.Provider
      value={{
        components: { ...defaultComponents, ...components },
        hooks: { ...defaultHooks, ...hooks },
        fn: { ...defaultFunctions, ...functions },
      }}
    >
      {children}
    </RuntimeContext.Provider>
  );
};

export const useRuntime = () => {
  const context = useContext(RuntimeContext);
  if (!context) {
    throw new Error('useRuntime must be used within a RuntimeProvider');
  }
  return context;
};
