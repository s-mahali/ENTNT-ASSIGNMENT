import React from "react";
import InitialLanding from "./components/InitialLanding";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignupPage from "./page/SignupPage";
import LoginPage from "./page/LoginPage";
import ManagePatientPage from "./page/ManagePatientPage";
import MainLayout from "./page/MainLayout";
import AppointmentPage from "./page/AppointmentPage";
import AdminDashboardPage from "./page/AdminDashboardPage";
import UserDashboardPage from "./page/UserDashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const user = JSON.parse(localStorage.getItem("user-cred" || []));
  const browserRouter = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,

      children: [
        {
          path: "/",
          element: <InitialLanding/>
        },
        {
          path: "/patients",
          element: (
            <ProtectedRoute role="admin">
              <ManagePatientPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/appointments",
          element: (
            <ProtectedRoute role="admin">
              <AppointmentPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/admindashboard",
          element: (
            <ProtectedRoute role="admin">
              <AdminDashboardPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/dashboard",
          element: (
            <ProtectedRoute role="user">
              <UserDashboardPage />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/signup",
      element: <SignupPage />,
    },
  ]);
  return (
    <>
      <RouterProvider router={browserRouter}></RouterProvider>
    </>
  );
};

export default App;
