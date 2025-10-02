import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // ตรวจสอบว่า import ถูกต้อง

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* BrowserRouter ควรอยู่ข้างนอกสุด */}
    <BrowserRouter>
      {/* AuthProvider ต้องครอบทุกอย่างที่อาจจะเรียกใช้ useAuth() */}
      <AuthProvider>
        {/* เพิ่ม defaultColorScheme="dark" เข้าไปที่นี่ */}
        <MantineProvider theme={{ fontFamily: 'Inter, sans-serif' }} 
          defaultColorScheme="dark"
          >
          <App />
        </MantineProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);