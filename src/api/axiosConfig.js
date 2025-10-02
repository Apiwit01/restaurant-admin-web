import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000'
});

// --- ส่วนที่ 1: Interceptor สำหรับ Request (เหมือนเดิม) ---
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- ส่วนที่ 2: Interceptor สำหรับ Response (ส่วนที่เพิ่มเข้ามา) ---
// ด่านตรวจจับ Error ที่เกิดขึ้นหลังจาก Backend ตอบกลับมา
axiosInstance.interceptors.response.use(
    (response) => {
        // ถ้า response สำเร็จ ก็ส่งต่อไปปกติ
        return response;
    },
    (error) => {
        // ถ้า Backend ตอบกลับมาเป็น Error
        if (error.response && error.response.status === 401) {
            // ถ้าเป็น Error 401 (Unauthorized/Token หมดอายุ)
            // ให้ทำการล้างข้อมูลผู้ใช้และส่งกลับไปหน้า Login
            console.log("Token expired or invalid. Logging out.");
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // ใช้ window.location เพื่อ force reload และ redirect
            window.location.href = '/login'; 
        }
        // ส่งต่อ Error ไปให้ .catch() ในโค้ดที่เรียกใช้จัดการต่อไป
        return Promise.reject(error);
    }
);

export default axiosInstance;