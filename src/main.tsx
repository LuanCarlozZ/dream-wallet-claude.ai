import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerAppServiceWorker } from "./lib/register-sw";

const root = document.getElementById("root");
if (root) createRoot(root).render(<App />);

void registerAppServiceWorker();
