import React, { createContext, useContext, type ReactNode } from 'react';
import { RuntimeComponents } from './component-types';
import { RuntimeHooks, AutoScrollConfig, AutoScrollResult } from './hook-types';
export type { AutoScrollConfig, AutoScrollResult };

export interface RuntimeContextValue {
  components: RuntimeComponents;
  hooks: RuntimeHooks;
}

const defaultComponents: RuntimeComponents = {
  Box: ({ children, ...props }) => <div {...props}>{children}</div>,
  Form: ({ children, ...props }) => <div {...props}>{children}</div>,
  Text: React.Fragment,
  Button: ({ children, variant, size, ...props }) => <button {...props}>{children}</button>,
  ScrollArea: ({ children, ...props }) => <div {...props} style={{ overflow: 'auto', ...props.style }}>{children}</div>,
  Input: (props) => <input {...props} />,
  Textarea: (props) => <textarea {...props} />,
  
  // Action bar
  ActionBarRoot: ({children}) => <>{children}</>,
  ActionBarPortal: ({children}) => <>{children}</>,
  ActionBarContent: ({children}) => <>{children}</>,
  ActionBarItem: ({children}) => <>{children}</>,
  ActionBarSeparator: ({children}) => <>{children}</>,
  ActionBarTrigger: ({children}) => <>{children}</>,
  
  // Thread List Item More
  ThreadListItemMoreRoot: ({children}) => <>{children}</>,
  ThreadListItemMorePortal: ({children}) => <>{children}</>,
  ThreadListItemMoreContent: ({children}) => <>{children}</>,
  ThreadListItemMoreItem: ({children}) => <>{children}</>,
  ThreadListItemMoreSeparator: ({children}) => <>{children}</>,
  ThreadListItemMoreTrigger: ({children}) => <>{children}</>,
  
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
  useHover: () => () => {},
};

const RuntimeContext = createContext<RuntimeContextValue>({
  components: defaultComponents,
  hooks: defaultHooks,
});

export const RuntimeProvider = ({
  components,
  hooks,
  children,
}: {
  components?: Partial<RuntimeComponents>;
  hooks?: Partial<RuntimeHooks>;
  children: ReactNode;
}) => {
  return (
    <RuntimeContext.Provider
      value={{
        components: { ...defaultComponents, ...components },
        hooks: { ...defaultHooks, ...hooks },
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
