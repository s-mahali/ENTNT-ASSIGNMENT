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

const App = () => {
  const browserRouter = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: <InitialLanding />,
        },
        {
          path: "/patients",
          element: <ManagePatientPage />,
        },
        {
          path: "/appointments",
          element: <AppointmentPage />,
        },
        {
          path: "/admindashboard",
          element: <AdminDashboardPage />,
        },
        {
          path: "/dashboard",
          element: <UserDashboardPage />,
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
