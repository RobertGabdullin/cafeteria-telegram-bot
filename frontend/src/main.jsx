import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/global.css";
import App from "./App";
import Home from "./components/Home/Home";
import NotFound from "./components/NotFound/NotFound";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/menu" element={<Home />} />
        <Route path="/menu/:namespace" element={<App />} />
        <Route path="/" element={<Navigate to="/menu" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);