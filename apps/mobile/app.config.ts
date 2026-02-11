import { ConfigContext, ExpoConfig } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    runtimeVersion: '1.0.0',
    name: 'Creatorem AI Chat Demo',
    slug: 'creatorem-ai-chat-demo',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/pwa-logo/apple-icon-180.png',
    scheme: 'creatorem-ai-chat-demo',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    jsEngine: 'hermes',
    updates: {
        url: 'https://u.expo.dev/31ba4806-f6c8-44ad-b6ca-52e410442b55',
    },
    splash: {
        image: './assets/pwa-logo/apple-splash-1242-2688.jpg',
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
    },
    ios: {
        jsEngine: 'jsc',
        supportsTablet: true,
        bundleIdentifier: 'com.creatorem.ai-chat-demo',
    },
    android: {
        // for native tabs
        softwareKeyboardLayoutMode: 'pan',
        adaptiveIcon: {
            // foregroundImage: './assets/images/adaptive-icon.png',
            backgroundColor: '#ffffff',
        },
        package: 'com.creatorem.ai-chat-demo',
        edgeToEdgeEnabled: true,
    },
    web: {
        bundler: 'metro',
        output: 'static',
        favicon: './assets/pwa-logo/apple-icon-180.png',
    },
    plugins: [
        'expo-router',
        'expo-font',
        'expo-web-browser',
        [
            'expo-dev-client',
            {
                launchMode: 'most-recent',
            },
        ],
        [
            'expo-secure-store',
            {
                configureAndroidBackup: true,
                faceIDPermission: 'Allow $(PRODUCT_NAME) to access your Face ID biometric data.',
            },
        ],
        [
            'expo-splash-screen',
            {
                image: './assets/pwa-logo/apple-splash-1242-2688.jpg',
                imageWidth: 200,
                resizeMode: 'contain',
                backgroundColor: '#ffffff',
            },
        ],
        [
            'expo-image-picker',
            {
                photosPermission: 'The app accesses your photos to let you share them with your friends.',
            },
        ],
    ],
    experiments: {
        typedRoutes: true,
        reactCompiler: true,
    },
    extra: {
        router: {
            origin: false,
        },
        eas: {
            projectId: '31ba4806-f6c8-44ad-b6ca-52e410442b55',
        },
    },
});
