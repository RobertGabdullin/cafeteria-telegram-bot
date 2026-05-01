import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/global.css";
import App from "./App";
import Home from "./components/Home/Home";
import NotFound from "./components/NotFound/NotFound";
import Login from "./components/Login/Login";
import AdminUpload from "./components/AdminUpload/AdminUpload";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
        <Routes>
          <Route path="/menu" element={<Home />} />
          <Route path="/menu/:namespace" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin/upload"
            element={
              <ProtectedRoute>
                <AdminUpload />
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={<Navigate to="/admin/upload" replace />} />
          <Route path="/" element={<Navigate to="/menu" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
