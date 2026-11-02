import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";

import './index.css'
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import MyList from './pages/MyList.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='login' element={<LoginPage />} />
        <Route path='register' element={<RegisterPage />} />
        <Route path='mylist' element={<MyList />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
