import { Navigate, createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/AuthLayout";
import PageNotFound from "../Pages/Error";
import LoginPage from "../Pages/LoginPage";
import HomePage from "../Pages/HomePage";
import ChatInfoBox from "../Components/ChatInfoBox"
let router;

let authRoutes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: "true",
        element: <Navigate to="/Home" replace />,
      },
      {
        path: "/Home",
        element: <HomePage />,
      },
      {
        path: "/user/:userid/:user2id",
        element: <ChatInfoBox />,
      },
    ],
  },
  {
    path: "/*",
    element: <PageNotFound />,
  },
];

let unAuthRoutes = [
  {
    path: "/",
    element: <LoginPage />,
    children: [
      {
        index: "true",
        element: <Navigate to="/Login" replace />,
      },
      {
        path: "/Login",
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "/*",
    element: <PageNotFound />,
  },
];

if (localStorage.getItem("chat-token")) {
  router = createBrowserRouter(authRoutes);
} else {
  router = createBrowserRouter(unAuthRoutes);
}

export default router