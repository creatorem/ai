import React, { type ComponentType } from 'react';

interface BaseComponentProps {
    className?: string;
    // style?: React.CSSProperties;
    style?: Record<string, string | number>;
    ref?: any;
}

type BaseComponentPropsWithChildren = BaseComponentProps & React.PropsWithChildren;

type TextareaStyle = Omit<NonNullable<React.CSSProperties>, 'maxHeight' | 'minHeight'> & {
    height?: number;
};

// type ButtonProps = Partial<Pick<React.ComponentProps<'button'>, 'disabled' | 'type'>> & BaseComponentPropsWithChildren & { variant?: 'ghost' | 'outline' | 'default'; size?: 'icon' | 'default'; onClick?: (e: Event) => void; }
type ButtonProps = Partial<Pick<React.ComponentProps<'button'>, 'disabled' | 'type'>> & BaseComponentPropsWithChildren & { onClick?: (e: Event) => void; }
type ButtonComponent = ComponentType<ButtonProps>

type Event = {
  preventDefault: () => void;
  stopPropagation: () => void;
  defaultPrevented: boolean;
}

export interface RuntimeComponents {
  Box: ComponentType<BaseComponentPropsWithChildren>
  Text: ComponentType<BaseComponentPropsWithChildren>
  // Shimmering: ComponentType<BaseComponentPropsWithChildren>
  // Form: ComponentType<BaseComponentPropsWithChildren & { onSubmit?: (e: Event) => void; }>
  Button: ButtonComponent
  // ScrollArea: ComponentType<BaseComponentPropsWithChildren>
  Input: ComponentType<BaseComponentProps & {
    autoFocus?: boolean;
    disabled?: boolean;
    onChange?: (value:string, e?: Event) => void;
    onKeyDown?: (e: Event) => void;
    onPaste?: (e: Event) => void;
    height?: number;
    rowHeight?: number;
    maxRows?: number;
    minRows?: number;
    onHeightChange?: (height: number) => void;
    cacheMeasurements?: boolean;
  }>

  // Content Components
  Markdown: ComponentType<BaseComponentProps & { content: string }>
  CodeBlock: ComponentType<BaseComponentProps & { language?: string; value: string }>
  Pre: ComponentType<BaseComponentPropsWithChildren>
  
  // Media Components
  Image: ComponentType<BaseComponentProps & { src: string; alt?: string }>
  Avatar: ComponentType<{ src?: string; fallback?: string; className?: string }>
  
  // Attachments
  ComposerPrimitiveAddAttachment: ButtonComponent;

  // Layout
  Separator: ComponentType<BaseComponentProps & { orientation?: 'horizontal' | 'vertical' }>
  
  // Logic/Wrappers
  MessageSpacer: ComponentType<BaseComponentPropsWithChildren>
 }
