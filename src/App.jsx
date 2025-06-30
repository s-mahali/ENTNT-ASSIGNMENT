import React from 'react'
import InitialLanding from './components/InitialLanding'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import SignupPage from './page/SignupPage'
import LoginPage from './page/LoginPage'
import ManagePatientPage from './page/ManagePatientPage'
import MainLayout from './page/MainLayout'
const App = () => {
  const browserRouter = createBrowserRouter([
    {
      path:"/",
      element:<MainLayout/>,
      children: [
          {
            path: "/",
            element: <InitialLanding/>,
          },
          {
            path: "/patient",
            element: <ManagePatientPage/>,
          },

      ]

    },
    {
      path: "/login",
      element: <LoginPage/>
      
    },
    {
      path: "/signup",
      element: <SignupPage/>
    }
  ])
  return (
   <>
   <RouterProvider router={browserRouter}>
     
   </RouterProvider>
   </>
  )
}

export default App