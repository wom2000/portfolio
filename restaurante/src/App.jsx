import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Homepage from './pages/homepage'
import Client from './pages/client'
import Kitchen from './pages/kitchen'
import Bar from './pages/bar'
import Signup from './pages/SignUp'
import Login from './pages/login'
import { AuthProvider } from './contexts/AuthContext'
import RootLayout from './components/layouts/RootLayout'
import ProtectedRoutes from './protectedRoutes/ProtectedRoutes'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { path: '/', element: <Homepage/> },
      { path: '/signup', element: <Signup/>},
      { path: '/login', element: <Login/>},
      {path: '/kitchen', element: (<ProtectedRoutes allowedRoles={['kitchen']}>
            <Kitchen/>
          </ProtectedRoutes>)},
      {path: '/client',element: (<ProtectedRoutes allowedRoles={['client']}>
            <Client/>
          </ProtectedRoutes>)},
      {path: '/bar', element: (<ProtectedRoutes allowedRoles={['bar']}>
            <Bar/>
          </ProtectedRoutes>)},

    ]
  },
])

function App() {
 return (<div className="container">
<AuthProvider> <RouterProvider router={router} /></AuthProvider>
      </div> 

  )
}

export default App
