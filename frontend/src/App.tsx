import { Link, Outlet } from "react-router-dom";
import "./util.css";
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import "./index.css";
import "./util.css";

export default function App() {
  return (
    <BrowserRouter>
      <main className="relative z-10 min-h-screen overflow-hidden p-6">
        <ToastContainer
        position="top-center"
        autoClose={5000}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}