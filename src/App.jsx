import React from 'react'
import InitialLanding from './components/InitialLanding'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import SignupPage from './page/SignupPage'
import LoginPage from './page/LoginPage'
const App = () => {
  const browserRouter = createBrowserRouter([
    {
      path:"/",
      element:<InitialLanding/>,
      children: [

      ]

    },
    {
      path: "/signin",
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