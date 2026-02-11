import * as Slot from '@rn-primitives/slot';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { GestureResponderEvent } from 'react-native';
import RNActionSheet, {
    ActionSheetProps as RNActionSheetProps,
    ActionSheetRef as RNActionSheetRef,
} from 'react-native-actions-sheet';
import { Pressable } from 'react-native';

export type ActionSheetContextType = {
    ref: React.RefObject<RNActionSheetRef | null>;
    open: boolean;
    setOpen: (newOpen: boolean) => void;
};

const ActionSheetContext = React.createContext<ActionSheetContextType>({
    ref: {} as React.RefObject<RNActionSheetRef | null>,
    open: false,
    setOpen: () => {},
});

export const useActionSheet = (): ActionSheetContextType => {
    const ctx = useContext(ActionSheetContext);
    if (!ctx) {
        throw new Error('action sheet context not found');
    }
    return ctx;
};

export const ActionSheet = ({
    children,
    open: propOpen,
    onOpenChange: propSetOpen,
    ref,
}: {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
} & Partial<ActionSheetContextType>) => {
    const [open, setOpen] = useState<boolean>(false);
    const actionSheetRef = useRef<RNActionSheetRef>(null);
    const finalRef = ref ?? actionSheetRef;
    const finalOpen = useMemo(() => propOpen ?? open, [propOpen, open]);

    useEffect(() => {
        if (finalOpen) {
            finalRef.current?.show();
        } else {
            finalRef.current?.hide();
        }
    }, [finalOpen]);

    const handleOpen = useCallback(
        (newOpen: boolean) => {
            propSetOpen?.(newOpen);
            setOpen(newOpen);
        },
        [propSetOpen],
    );

    return (
        <ActionSheetContext.Provider value={{ ref: finalRef, open: finalOpen, setOpen: handleOpen }}>
            {children}
        </ActionSheetContext.Provider>
    );
};

export const ActionSheetTrigger: React.FC<React.ComponentPropsWithRef<typeof Pressable> & { asChild?: boolean }> = ({
    children,
    asChild,
    onPress,
    ...props
}) => {
    const { ref } = useActionSheet();
    const Comp = asChild ? Slot.Pressable : Pressable;

    const handleOpen = useCallback((event: GestureResponderEvent) => {
        onPress?.(event);
        ref.current?.show();
    }, []);

    return (
        <Comp {...props} onPress={handleOpen}>
            {children}
        </Comp>
    );
};

interface ThemedActionSheetProps extends RNActionSheetProps {}

export const ActionSheetContent: React.FC<ThemedActionSheetProps> = ({ containerStyle, ...props }) => {
    const { ref, setOpen } = useActionSheet();

    return (
        <RNActionSheet
            {...props}
            ref={ref}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            containerStyle={{
                paddingBottom: 24,
                // backgroundColor: colors['--color-secondary'],
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                // @ts-expect-error
                ...containerStyle,
            }}
            gestureEnabled
        />
    );
};
