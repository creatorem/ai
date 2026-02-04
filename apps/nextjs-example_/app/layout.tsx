import type { Viewport } from 'next';
import React from 'react';
import { withI18n } from '~/lib/i18n.server';
import { generateRootMetadata } from '~/lib/root-metdata';

import './globals.css';

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    minimumScale: 1,
    maximumScale: 1,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: 'white' },
        { media: '(prefers-color-scheme: dark)', color: 'black' },
    ],
};

export const generateMetadata = withI18n(async () => {
    return await generateRootMetadata();
});

function RootLayout({ children }: React.PropsWithChildren) {
    return children;
}

export default withI18n(RootLayout);
