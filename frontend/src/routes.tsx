import { createBrowserRouter } from 'react-router-dom';
//import { Dashboard } from './pages/app/dashboard';
import { Login } from './pages/auth/login';

import { AuthLayout } from './pages/_layouts/auth';

import { Homepage } from './pages/app/homepage';
import { RegisterLayout } from './pages/_layouts/register';
import Register from './pages/app/register';
import { ServiceRegisterLayout } from './pages/_layouts/service-register';
import ServiceRegister from './pages/app/service-register';
import { PatientRegisterLayout } from './pages/_layouts/patient-register';
import PatientRegister from './pages/app/patient-register';
import { EmployeeRegisterLayout } from './pages/_layouts/employee-register';
import EmployeeRegister from './pages/app/employee-register';
import { HomeLayout } from './pages/_layouts/home';


export const router = createBrowserRouter([
  { 
    path: '/login', 
    element: <AuthLayout />, 
    children: [
      { path: '/login', element: <Login /> }
    ]
  },
  { 
    path: '/',
    element: <HomeLayout />, 
    children: [
      { path: '/', element: <Homepage /> }
    ]
  },
  { 
    path: '/register',
    element: <RegisterLayout />, 
    children: [
      { path: '/register', element: <Register /> }
    ]
  },
  { 
    path: '/service-register',
    element: <ServiceRegisterLayout />, 
    children: [
      { path: '/service-register', element: <ServiceRegister /> },
    ]
  },
  { 
    path: '/patient-register',
    element: <PatientRegisterLayout />, 
    children: [
      { path: '/patient-register', element: <PatientRegister /> }
    ]
  },
  { 
    path: '/employee-register',
    element: <EmployeeRegisterLayout />, 
    children: [
      { path: '/employee-register', element: <EmployeeRegister /> }
    ]
  },
])