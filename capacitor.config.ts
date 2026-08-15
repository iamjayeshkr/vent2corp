import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.vent2corp.app",
  appName: "vent2corp",
  webDir: "public",
  server: {
    url: "http://192.168.1.190:3000",
    androidScheme: "https",
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: "#09090B",
      androidSplashResourceName: "splash",
      showSpinner: false,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#09090B",
    },
    Keyboard: {
      resize: "body",
      style: "DARK",
    },
  },
};

export default config;
