import { Link, Outlet } from "react-router-dom";
import "./util.css";
import Home from "./pages/Home";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function App() {
  return (
    <main className="p-6">
      <Outlet />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"  // 好みで "colored" など
      />
      <Home/>
    </main>
  );
}
