import "./util.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BaseInfo from "./pages/BaseInfo";
import QnA from "./pages/QnA/QnA";
import "./index.css";
import ShowResult from "./pages/ShowResult";
export default function App() {
  return (
    <BrowserRouter>
      <main className="relative z-10 min-h-screen overflow-hidden">
        <ToastContainer
        position="top-center"
        autoClose={7000}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms/:roomId" element={<BaseInfo/>}/>
          <Route path="/rooms/:roomId/QnA" element={<QnA/>}/>
          <Route path="/rooms/:roomId/results" element={<ShowResult />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}