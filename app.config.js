import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  name: 'FusionMobile',
  slug: 'fusion-mobile',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'fusion',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,

  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    googleServicesFile: './google-services.json',
    package: 'com.fusion.mobile',
    useNextNotificationsApi: true,
    softwareKeyboardLayoutMode: 'resize',
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
    bundler: 'metro',
  },
  plugins: [
    'expo-router',
    'expo-notifications',
    'expo-image-picker',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
        dark: {
          backgroundColor: '#000000',
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    FUSION_API_BASE_URL: process.env.FUSION_API_BASE_URL || 'http://10.0.2.2:5191/api',
    FUSION_API_BASE_URL_REAL_DEVICE:
      process.env.FUSION_API_BASE_URL_REAL_DEVICE || 'http://192.168.0.106:5191/api',
    eas: {
      projectId: '87d06425-2ddd-42e4-91d3-4b8173353533',
    },
  },
});
