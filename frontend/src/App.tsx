import { Link, Outlet } from "react-router-dom";
import "./util.css";

export default function App() {
  return (
    <main className="p-6">
      <Outlet />
    </main>
  );
}
