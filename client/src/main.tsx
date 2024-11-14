import { createRoot } from "react-dom/client";
import App from "./App.tsx"; // Or the full absolute path

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <>
    <App />
  </>
);
