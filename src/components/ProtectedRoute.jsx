import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        // ถ้าไม่มี user ใน state ให้ส่งกลับไปหน้า login
        return <Navigate to="/login" />;
    }

    // ถ้ามี user ให้แสดงหน้า Component นั้นๆ
    return children;
};

export default ProtectedRoute;