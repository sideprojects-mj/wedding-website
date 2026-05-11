declare global {
  interface Window {
    __APP_CONFIG__?: {
      VITE_API_URL?: string;
      VITE_ADMIN_PASSCODE?: string;
    };
  }
}

export const API_BASE_URL =
  window.__APP_CONFIG__?.VITE_API_URL || import.meta.env.VITE_API_URL || "";

export const ADMIN_PASSCODE =
  window.__APP_CONFIG__?.VITE_ADMIN_PASSCODE || import.meta.env.VITE_ADMIN_PASSCODE || "0926";

