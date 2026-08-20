import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import { client } from "./api/client";
import { enableFastStartup } from "./api/fastStartup";
import { ToastProvider } from "./components/ToastProvider";
import FeedbackPage from "./pages/FeedbackPage";

import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const normalizedPath = window.location.pathname.replace(/\/+$/, "") || "/";
const isFeedbackPage = normalizedPath === "/feedback";

if (!isFeedbackPage) {
  enableFastStartup(client);
}

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.register("/sw.js").catch((error) => {
    console.warn("Image cache service worker registration failed:", error);
  });
}

createRoot(rootElement).render(
  <StrictMode>
    {isFeedbackPage ? (
      <FeedbackPage />
    ) : (
      <ToastProvider>
        <App />
      </ToastProvider>
    )}
  </StrictMode>
);
