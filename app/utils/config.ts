// Extend the Window interface to include RUNTIME_CONFIG
declare global {
  interface Window {
    RUNTIME_CONFIG?: {
      BASE_URL?: string;
      HISTORY_TOKEN_ID?: string;
      HISTORY_TOKEN?: string;
      TOKEN_ID?: string;
      TOKEN?: string;
      USER_ID?: string;
      FAXLINE_ID?: string;
    };
  }
}

// Check if we're running in a browser environment
const isBrowser = typeof window !== "undefined";

export const getConfig = () => {
  // Runtime variables (sensitive)
  let runtimeConfig = {
    BASE_URL: "",
    HISTORY_TOKEN_ID: "",
    HISTORY_TOKEN: "",
    TOKEN_ID: "",
    TOKEN: "",
    USER_ID: "",
    FAXLINE_ID: "",
  };

  // Try to get values from window.RUNTIME_CONFIG in browser environment
  if (isBrowser) {
    try {
      runtimeConfig = {
        BASE_URL:
          window.RUNTIME_CONFIG?.BASE_URL ||
          import.meta.env.VITE_BASE_URL ||
          "",
        HISTORY_TOKEN_ID: window.RUNTIME_CONFIG?.HISTORY_TOKEN_ID || "",
        HISTORY_TOKEN: window.RUNTIME_CONFIG?.HISTORY_TOKEN || "",
        TOKEN_ID: window.RUNTIME_CONFIG?.TOKEN_ID || "",
        TOKEN: window.RUNTIME_CONFIG?.TOKEN || "",
        USER_ID: window.RUNTIME_CONFIG?.USER_ID || "",
        FAXLINE_ID: window.RUNTIME_CONFIG?.FAXLINE_ID || "",
      };
    } catch (error) {
      console.warn("Failed to access window.RUNTIME_CONFIG", error);
    }
  } else {
    if (typeof process !== "undefined" && process.env) {
      runtimeConfig = {
        BASE_URL: process.env.BASE_URL || import.meta.env.VITE_BASE_URL || "",
        HISTORY_TOKEN_ID: process.env.HISTORY_TOKEN_ID || "",
        HISTORY_TOKEN: process.env.HISTORY_TOKEN || "",
        TOKEN_ID: process.env.TOKEN_ID || "",
        TOKEN: process.env.TOKEN || "",
        USER_ID: process.env.USER_ID || "",
        FAXLINE_ID: process.env.FAXLINE_ID || "",
      };
    }
  }

  return runtimeConfig;
};
