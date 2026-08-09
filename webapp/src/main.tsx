import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import { client } from "./api/client";
import { enableFastStartup } from "./api/fastStartup";
import { ToastProvider } from "./components/ToastProvider";

import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

enableFastStartup(client);

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.register("/sw.js").catch((error) => {
    console.warn("Image cache service worker registration failed:", error);
  });
}

createRoot(rootElement).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>
);
