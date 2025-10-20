import React, { useState } from 'react';
import axios from 'axios';
import {
    Paper,
    Title,
    TextInput,
    PasswordInput,
    Button,
    Container,
    Text as MantineText,
    Select,
    LoadingOverlay // 1. Import LoadingOverlay
} from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';

// URL ของ Backend API
const API_URL = 'http://localhost:3000';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('kitchen');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // 2. เพิ่ม state สำหรับ loading
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true); // 3. เริ่ม loading

        // เพิ่มการตรวจสอบค่าว่างเบื้องต้น
        if (!username || !password || !role) {
            setError('กรุณากรอกข้อมูลให้ครบทุกช่อง');
            setLoading(false);
            return;
        }

        try {
            await axios.post(`${API_URL}/api/users/register`, { username, password, role });
            alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'การสมัครสมาชิกล้มเหลว');
        } finally {
            setLoading(false); // 4. หยุด loading ไม่ว่าจะสำเร็จหรือล้มเหลว
        }
    };

    return (
        <Container size={420} my={40}>
            <Title ta="center">สมัครสมาชิกใหม่</Title>
            {/* 5. เพิ่ม pos="relative" ให้ Paper เพื่อให้ LoadingOverlay ทำงานถูกตำแหน่ง */}
            <Paper withBorder shadow="md" p={30} mt={30} radius="md" component="form" onSubmit={handleSubmit} pos="relative">
                {/* 6. เพิ่ม LoadingOverlay */}
                <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

                <TextInput
                    label="Username"
                    placeholder="Your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} // ใช้ e.target.value เหมือนเดิมได้ครับ
                    required
                />
                <PasswordInput
                    label="Password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    mt="md"
                />
                <Select
                    label="Role (ตำแหน่ง)"
                    // 7. แก้ไข data ให้เป็น object และเพิ่ม manager
                    data={[
                        { value: 'admin', label: 'Admin' },
                        { value: 'manager', label: 'Manager' },
                        { value: 'kitchen', label: 'Kitchen Staff' },
                    ]}
                    value={role}
                    onChange={setRole} // Mantine v7+ ใช้ onChange โดยตรงได้เลย
                    required
                    mt="md"
                />
                {error && <MantineText color="red" size="sm" mt="sm">{error}</MantineText>}
                <Button fullWidth mt="xl" type="submit">
                    สมัครสมาชิก
                </Button>
                {/* ปุ่มกลับไปหน้า Login ของคุณยังอยู่ครบ */}
                <Button component={Link} to="/login" variant="subtle" fullWidth mt="md">
                    กลับไปหน้าเข้าสู่ระบบ
                </Button>
            </Paper>
        </Container>
    );
};

export default RegisterPage;