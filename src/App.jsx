// src/App.jsx

// --- 1. เอา BrowserRouter ออกจากการ import ---
import { Routes, Route } from 'react-router-dom';

// ----- ส่วน import อื่นๆ เหมือนเดิม -----
import MainLayout from '@/layouts/MainLayout.jsx';
import Dashboard from '@/pages/Dashboard.jsx';
import IngredientList from '@/pages/IngredientList.jsx';
import MenuList from '@/pages/MenuList.jsx';
import CookingHistory from '@/pages/CookingHistory.jsx';
import ReportPage from '@/pages/ReportPage.jsx';
import LoginPage from '@/pages/LoginPage.jsx';

function App() {
  // --- 2. เอา <BrowserRouter> ที่ครอบอยู่ออกไป ---
  return (
    <Routes>
      {/* หน้าที่ไม่ต้องการให้มี Layout เช่น หน้า Login */}
      <Route path="/login" element={<LoginPage />} />

      {/* จัดกลุ่ม Route ที่ต้องใช้ MainLayout เข้าด้วยกัน */}
      <Route
        path="/*"
        element={
          <MainLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/ingredients" element={<IngredientList />} />
              <Route path="/menus" element={<MenuList />} />
              <Route path="/history" element={<CookingHistory />} />
              <Route path="/reports" element={<ReportPage />} />
            </Routes>
          </MainLayout>
        }
      />
    </Routes>
  );
}

export default App;