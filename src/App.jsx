// src/App.jsx

import { Routes, Route } from 'react-router-dom';

// ----- Import Layouts and Pages -----
import MainLayout from '@/layouts/MainLayout.jsx';
import Dashboard from '@/pages/Dashboard.jsx';
import IngredientList from '@/pages/IngredientList.jsx';
import MenuList from '@/pages/MenuList.jsx';
import CookingHistory from '@/pages/CookingHistory.jsx';
import ReportPage from '@/pages/ReportPage.jsx';
import LoginPage from '@/pages/LoginPage.jsx';
import RegisterPage from '@/pages/RegisterPage.jsx'; // 1. Import RegisterPage เข้ามา

function App() {
  return (
    <Routes>
      {/* หน้าที่ไม่ต้องการให้มี Layout เช่น Login, Register */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} /> {/* 2. เพิ่ม Route สำหรับ /register */}

      {/* จัดกลุ่ม Route ที่ต้องใช้ MainLayout */}
      <Route
        path="/*" // Route นี้จะจับคู่กับ URL อื่นๆ ที่ยังไม่ถูกจับคู่ข้างบน
        element={
          <MainLayout>
            <Routes> {/* ต้องมี Routes ซ้อนข้างในสำหรับ Layout */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/ingredients" element={<IngredientList />} />
              <Route path="/menus" element={<MenuList />} />
              <Route path="/history" element={<CookingHistory />} />
              <Route path="/reports" element={<ReportPage />} />
              {/* คุณสามารถเพิ่ม Route อื่นๆ ที่ต้องการ Layout ได้ที่นี่ */}
              {/* เช่น <Route path="/settings" element={<SettingsPage />} /> */}
            </Routes>
          </MainLayout>
        }
      />
    </Routes>
  );
}

export default App;