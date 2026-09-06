import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.localdiscover.mobile",
  appName: "Local Discover",
  webDir: "out",
  server: {
    androidScheme: "https",
    // The native app loads the hosted web UI from Vercel.
    // This gives us real API routes, auth, reviews, messages — everything.
    // Capacitor plugins (Apple Sign In, SplashScreen, etc.) still work via the JS bridge.
    // Set CAPACITOR_API_URL to your Vercel deployment URL in .env.local:
    //   CAPACITOR_API_URL=https://your-app.vercel.app
    url: process.env.CAPACITOR_API_URL || undefined,
    cleartext: !process.env.CAPACITOR_API_URL, // cleartext only for local dev
    // Allow navigation within the hosted app
    allowNavigation: ["*"],
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
