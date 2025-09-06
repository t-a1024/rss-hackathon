import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import BaseInfo from "./pages/BaseInfo";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",               
    element: <App />,       
    children: [
      { index: true, element: <Home /> },           
      { path: "base-info", element: <BaseInfo /> },        
      { path: "*", element: <div>Not Found</div> }, 
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
