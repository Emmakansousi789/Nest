import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.localdiscover.mobile",
  appName: "Local Discover",
  webDir: "out",
  server: {
    androidScheme: "https",
    // Allow loading from local server during development
    url: process.env.CAPACITOR_DEV_URL || undefined,
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 2000,
      backgroundColor: "#FBF9F5",
      showSpinner: true,
      spinnerColor: "#C84B31",
    },
    Keyboard: {
      resize: "body",
      style: "dark",
      resizeOnFullScreen: true,
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#FBF9F5",
    },
  },
  ios: {
    contentInset: "automatic",
    backgroundColor: "#FBF9F5",
    preferredContentMode: "mobile",
  },
  android: {
    backgroundColor: "#FBF9F5",
    allowMixedContent: true,
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
  },
};

export default config;
