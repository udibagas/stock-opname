import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Extend the Window interface to include the cordova property
declare global {
  interface Window {
    cordova?: unknown;
  }
}

const renderReactDom = () => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

if (window.cordova) {
  document.addEventListener("deviceready", renderReactDom, false);
} else {
  renderReactDom();
}
