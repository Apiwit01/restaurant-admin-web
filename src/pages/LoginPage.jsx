import React, { useState } from 'react';
import { Paper, Title, TextInput, PasswordInput, Button, Container, Text as MantineText } from '@mantine/core';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(username, password);
        } catch (err) {
            setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
        }
    };

    return (
        <Container size={420} my={40}>
            <Title ta="center">ล็อกอินเข้าสู่ระบบ</Title>
            <MantineText c="dimmed" size="sm" ta="center" mt={5}>
                กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ
            </MantineText>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md" component="form" onSubmit={handleSubmit}>
                <TextInput label="Username" placeholder="Your username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <PasswordInput label="Password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} required mt="md" />
                {error && <MantineText color="red" size="sm" mt="sm">{error}</MantineText>}
                <Button fullWidth mt="xl" type="submit">
                    เข้าสู่ระบบ
                </Button>
                <Button component={Link} to="/register" variant="subtle" fullWidth mt="md">
                    ยังไม่มีบัญชี? สมัครสมาชิก
                </Button>
            </Paper>
        </Container>
    );
};

export default LoginPage;