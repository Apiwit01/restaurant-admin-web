import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig'; // 1. Import instance ใหม่

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // เพิ่ม isLoading state
    const navigate = useNavigate();

    // --- ส่วนที่เพิ่มเข้ามา ---
    useEffect(() => {
        // ฟังก์ชันนี้จะทำงานแค่ครั้งเดียวตอนแอปเปิด
        const loadUserFromStorage = () => {
            try {
                const token = localStorage.getItem('token');
                const userDataString = localStorage.getItem('user');
                
                if (token && userDataString) {
                    const userData = JSON.parse(userDataString);
                    // ตั้งค่า axios header สำหรับทุก request ในอนาคต
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    setUser(userData);
                }
            } catch (error) {
                console.error("Could not load user from local storage", error);
            } finally {
                setIsLoading(false); // โหลดเสร็จแล้ว
            }
        };

        loadUserFromStorage();
    }, []); // array ว่าง หมายถึงให้รันแค่ครั้งเดียว

    const login = async (username, password) => {
        try {
            const response = await axiosInstance.post('http://localhost:3000/api/users/login', { username, password });
            const { token, user: userData } = response.data;

            // เก็บ token และ user data ลง localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            // ตั้งค่า axios header
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            setUser(userData);
            navigate('/'); // ส่งไปหน้า Dashboard หลัง login สำเร็จ
        } catch (err) {
            console.error("Login failed", err);
            throw err; // โยน error ต่อเพื่อให้หน้า Login แสดงข้อความ
        }
    };

    const logout = () => {
        // ลบข้อมูลออกจาก localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // ลบ axios header
        delete axios.defaults.headers.common['Authorization'];

        setUser(null);
        navigate('/login'); // ส่งไปหน้า Login หลัง logout
    };

    // ถ้ายังโหลดข้อมูลจาก localStorage ไม่เสร็จ ให้ยังไม่แสดงผลแอป
    if (isLoading) {
        return <div>Loading Application...</div>; 
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
// --- สิ้นสุดการแก้ไข ---

export const useAuth = () => {
    return useContext(AuthContext);
};