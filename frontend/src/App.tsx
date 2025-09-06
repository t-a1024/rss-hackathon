import { useEffect, useState } from 'react';
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <>
    <main>
      {/* 中央寄せ用のラッパ。スマホは上詰め、md以降は縦中央 */}
      <Home />
      <ToastContainer position="top-center" autoClose={4000} />
    </main>
    </>
  )
}

export default App;