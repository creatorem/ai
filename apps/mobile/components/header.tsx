import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '~/utils/cn';
import { Icon } from './ui/icon';
import {  router } from 'expo-router';

type HeaderProps = {
    title?: string;
    children?: React.ReactNode;
    showBackButton?: boolean;
    onBackPress?: () => void;
    rightComponents?: React.ReactNode[];
    leftComponent?: React.ReactNode;
    className?: string;
    style?: ViewStyle;
    collapsible?: boolean;
    visible?: boolean;
    variant?: 'default' | 'transparent' | 'blurred';
};

export const Header: React.FC<HeaderProps> = ({
    title,
    children,
    showBackButton = false,
    onBackPress,
    rightComponents = [],
    leftComponent,
    className,
    style,
    collapsible = false,
    visible = true,
    variant = 'default',
}) => {
    const translateY = useRef(new Animated.Value(0)).current;

    const isTransparent = variant === 'transparent';
    const isBlurred = variant === 'blurred';
    const insets = useSafeAreaInsets();
    useEffect(() => {
        if (!collapsible) return;

        if (visible) {
            translateY.setValue(-70);

            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
                tension: 30,
                friction: 50,
                velocity: 3,
            }).start();
        }
        else {
            Animated.spring(translateY, {
                toValue: -150,
                useNativeDriver: true,
                tension: 80,
                friction: 12,
                velocity: 2,
            }).start();
        }
    }, [visible, collapsible, translateY]);

    const handleBackPress = useCallback(() => {
        if (!showBackButton) return;
        if (onBackPress) {
            onBackPress();
        } else {
            router.back();
        }
    }, [showBackButton, onBackPress]);

    const AnimatedView = Animated.createAnimatedComponent(View);

    const containerStyle =
        collapsible || isTransparent || isBlurred
            ? {
                  paddingTop: insets.top,
                  transform: collapsible ? [{ translateY }] : undefined,
                  position: 'absolute' as const,
                  top: 0,
                  left: 0,
                  right: 0,
                  zIndex: 100,
              }
            : { paddingTop: insets.top };

    return (
        <AnimatedView style={[style, containerStyle]}>
            {variant === 'default' && <View className="absolute inset-0 bg-background" />}
             <View className={cn(`relative z-50 flex w-full flex-row justify-between px-6`, className)}>
            {(showBackButton || leftComponent || title) && (
                <View className="flex-row items-center">
                    {showBackButton && (
                        <TouchableOpacity onPress={handleBackPress} className="relative z-50 mr-4 py-4">
                            <Icon
                                name="ArrowLeft"
                                size={24}
                            />
                        </TouchableOpacity>
                    )}

                    {leftComponent ||
                        (title && (
                            <View className="relative z-50 flex-row items-center py-4">
                                {leftComponent}

                                {title && <Text className="font-bold text-foreground text-xl">{title}</Text>}
                            </View>
                        ))}
                </View>
            )}

            {rightComponents.length > 0 && (
                <View className="relative z-50 flex-row items-center justify-end">
                    {rightComponents.map((component, index) => (
                        <View key={index} className="ml-6">
                            {component}
                        </View>
                    ))}
                </View>
            )}
            {children}
        </View>
        </AnimatedView>
    );
};
