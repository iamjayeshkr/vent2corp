import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { App } from "@capacitor/app";

export function isNativePlatform(): boolean {
  return Capacitor.isNativePlatform();
}

export function getPlatform(): string {
  return Capacitor.getPlatform();
}

export async function initCapacitorMobile(): Promise<void> {
  if (!isNativePlatform()) return;

  try {
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: "#09090B" });
  } catch {
    // Platform-specific status bar fallback
  }

  try {
    await SplashScreen.hide();
  } catch {
    // Platform-specific splash screen fallback
  }
}

export async function triggerHaptic(type: "light" | "medium" | "heavy" = "medium"): Promise<void> {
  if (!isNativePlatform()) return;
  try {
    const styleMap = {
      light: ImpactStyle.Light,
      medium: ImpactStyle.Medium,
      heavy: ImpactStyle.Heavy,
    };
    await Haptics.impact({ style: styleMap[type] });
  } catch {
    // Platform-specific haptics fallback
  }
}

export function registerBackButtonHandler(onBack: () => boolean): void {
  if (!isNativePlatform()) return;
  App.addListener("backButton", () => {
    const handled = onBack();
    if (!handled) {
      void App.exitApp();
    }
  });
}
