import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import Beneficiary from "./pages/Beneficiary.tsx";
import Donor from "./pages/Donor.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/beneficiary" element={<Beneficiary />} />
        <Route path="/donor" element={<Donor />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
