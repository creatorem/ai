import { cva, type VariantProps } from 'class-variance-authority';
import { Href, Link } from 'expo-router';
import type * as LucideIcons from 'lucide-react-native';
import {
    ArrowLeftIcon,
    CheckIcon,
    XIcon,
} from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';
import { withUniwind } from 'uniwind';
import { cn } from '~/utils/cn';


type AllLucideIconName = Exclude<keyof typeof LucideIcons, 'createLucideIcon' | 'LucideProps' | 'default'>;

const lucideIcons = {
    ArrowLeft: ArrowLeftIcon,
    Check: CheckIcon,
    X: XIcon,
} satisfies {
    [key in AllLucideIconName]?: LucideIcons.LucideIcon;
};

type IconName = keyof typeof lucideIcons;

const sizeMap = {
    xs: 16,
    s: 20,
    m: 24,
    l: 32,
    xl: 40,
    xxl: 48,
};

const iconVariants = cva('items-center justify-center', {
    variants: {
        variant: {
            plain: '',
            bordered: 'rounded-full border border-border',
            contained: 'rounded-full bg-secondary',
        },
        iconSize: {
            xs: 'h-8 w-8',
            s: 'h-10 w-10',
            m: 'h-12 w-12',
            l: 'h-16 w-16',
            xl: 'h-20 w-20',
            xxl: 'h-24 w-24',
        },
    },
    defaultVariants: {
        variant: 'plain',
        iconSize: undefined,
    },
});

interface IconProps extends VariantProps<typeof iconVariants> {
    name: IconName;
    size?: number;
    color?: string;
    href?: Href;
    onPress?: () => void;
    disabled?: boolean;
    className?: string;
    colorClassName?: string;
    strokeWidth?: number;
    fill?: string;
}

export const Icon: React.FC<IconProps> = ({
    name,
    size,
    variant,
    iconSize,
    color,
    href,
    onPress,
    disabled = false,
    className,
    colorClassName,
    strokeWidth = 2,
    fill = 'none',
}) => {

    const getSize = () => {
        if (typeof size === 'number') {
            return size;
        }
        if (iconSize && sizeMap[iconSize]) {
            return sizeMap[iconSize];
        }
        return 24;
    };

    const getIconComponent = () => {
        if (!(name in lucideIcons)) {
            throw new Error(`Icon ${name} is not installed.`);
        }
        return lucideIcons[name as IconName] as React.ComponentType<LucideIcons.LucideProps>;
    };

    const IconComponent = withUniwind(getIconComponent());

    const content = (
        <View
            {...({ className: cn(iconVariants({ variant, iconSize: variant !== 'plain' ? iconSize : undefined }), className) } as any)}
        >
            <IconComponent
                size={getSize()}
                colorClassName={cn('text-foreground', colorClassName)}
                strokeWidth={strokeWidth}
                fill={fill}
            />
        </View>
    );

    if (href) {
        return (
            <Link href={href} asChild>
                <Pressable disabled={disabled}>{content}</Pressable>
            </Link>
        );
    }

    if (onPress) {
        return (
            <Pressable
                onPress={disabled ? undefined : onPress}
                disabled={disabled}
                className={cn(
                    iconVariants({ variant, iconSize: variant !== 'plain' ? iconSize : undefined }),
                    className,
                )}
            >
                <IconComponent
                    size={getSize()}
                    colorClassName={cn('text-foreground', colorClassName)}
                    strokeWidth={strokeWidth}
                    fill={fill}
                />
            </Pressable>
        );
    }

    return content;
};

export type { IconName };
