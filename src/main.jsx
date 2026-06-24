import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Yahan se '!' hata diya gaya hai kyunki ye JavaScript hai
createRoot(document.getElementById("root")).render(<App />);