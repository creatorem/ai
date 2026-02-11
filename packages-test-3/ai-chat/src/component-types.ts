import React, { type ComponentType } from 'react';

interface BaseComponentProps {
    className?: string;
    style?: React.CSSProperties;
    ref?: any;
}

type BaseComponentPropsWithChildren = BaseComponentProps & React.PropsWithChildren;

type TextareaStyle = Omit<NonNullable<React.CSSProperties>, 'maxHeight' | 'minHeight'> & {
    height?: number;
};

type ButtonProps = Partial<Pick<React.ComponentProps<'button'>, 'disabled' | 'type'>> & BaseComponentPropsWithChildren & { variant?: 'ghost' | 'outline' | 'default'; size?: 'icon' | 'default'; onClick?: (e: Event) => void; }
type ButtonComponent = ComponentType<ButtonProps>

type Event = {
  preventDefault: () => void;
  stopPropagation: () => void;
  defaultPrevented: boolean;
}

export interface RuntimeComponents {
  Box: ComponentType<BaseComponentPropsWithChildren>
  Text: ComponentType<BaseComponentPropsWithChildren>
  Form: ComponentType<BaseComponentPropsWithChildren & { onSubmit?: (e: Event) => void; }>
  Button: ButtonComponent
  ScrollArea: ComponentType<BaseComponentPropsWithChildren>
  Input: ComponentType<BaseComponentProps & { value?: string; onChange?: (e: Event) => void; placeholder?: string }>
  Textarea: ComponentType<BaseComponentProps & Partial<React.ComponentProps<'textarea'>> & {
      autoFocus?: boolean;
      asChild?: boolean;
      disabled?: boolean;
      onChange?: (e: Event) => void;
      onKeyDown?: (e: Event) => void;
      onPaste?: (e: Event) => void;
      height?: number;
    rowHeight?: number;
    maxRows?: number;
    minRows?: number;
    onHeightChange?: (height: number) => void;
    cacheMeasurements?: boolean;
    style?: TextareaStyle;
  }>

    //  value?: string; onChange?: (e: any) => void; placeholder?: string; onKeyDown?: (e: React.KeyboardEvent) => void; }>

  // Action bar
  ActionBarRoot: ComponentType<BaseComponentPropsWithChildren>
  ActionBarPortal: ComponentType<BaseComponentPropsWithChildren>
  ActionBarContent: ComponentType<BaseComponentPropsWithChildren & {sideOffset: number}>
  ActionBarItem: ComponentType<BaseComponentPropsWithChildren>
  ActionBarSeparator: ComponentType<BaseComponentPropsWithChildren>
  ActionBarTrigger: ComponentType<BaseComponentPropsWithChildren>

  // Thread List Item More
  ThreadListItemMoreRoot: ComponentType<BaseComponentPropsWithChildren>
  ThreadListItemMorePortal: ComponentType<BaseComponentPropsWithChildren>
  ThreadListItemMoreContent: ComponentType<BaseComponentPropsWithChildren & {sideOffset: number}>
  ThreadListItemMoreItem: ComponentType<BaseComponentPropsWithChildren>
  ThreadListItemMoreSeparator: ComponentType<BaseComponentPropsWithChildren>
  ThreadListItemMoreTrigger: ComponentType<BaseComponentPropsWithChildren>

  // Content Components
  Markdown: ComponentType<BaseComponentProps & { content: string }>
  CodeBlock: ComponentType<BaseComponentProps & { language?: string; value: string }>
  Pre: ComponentType<BaseComponentPropsWithChildren>
  
  // Media Components
  Image: ComponentType<BaseComponentProps & { src: string; alt?: string }>
  Avatar: ComponentType<{ src?: string; fallback?: string; className?: string }>
  
  // Attachments
  ComposerPrimitiveAddAttachment: ButtonComponent;

  Attachment: ComponentType<{ 
    name: string; 
    contentType?: string; 
    url?: string; 
    size?: number;
    onRemove?: () => void;
    className?: string 
  }>

  // Layout
  Separator: ComponentType<BaseComponentProps & { orientation?: 'horizontal' | 'vertical' }>
  
  // Logic/Wrappers
  MessageSpacer: ComponentType<BaseComponentPropsWithChildren>
 }
