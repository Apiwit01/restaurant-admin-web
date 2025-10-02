import React, { useState } from 'react';
import axios from 'axios';
import { Paper, Title, TextInput, PasswordInput, Button, Container, Text as MantineText, Select } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('kitchen'); // ค่าเริ่มต้น
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('http://localhost:3000/api/users/register', { username, password, role });
            alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'การสมัครสมาชิกล้มเหลว');
        }
    };

    return (
        <Container size={420} my={40}>
            <Title ta="center">สมัครสมาชิกใหม่</Title>
            <Paper withBorder shadow="md" p={30} mt={30} radius="md" component="form" onSubmit={handleSubmit}>
                <TextInput label="Username" placeholder="Your username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <PasswordInput label="Password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} required mt="md" />
                <Select
                    label="Role"
                    data={['admin', 'kitchen']}
                    value={role}
                    onChange={setRole}
                    required
                    mt="md"
                />
                {error && <MantineText color="red" size="sm" mt="sm">{error}</MantineText>}
                <Button fullWidth mt="xl" type="submit">
                    สมัครสมาชิก
                </Button>
                <Button component={Link} to="/login" variant="subtle" fullWidth mt="md">
                    กลับไปหน้าเข้าสู่ระบบ
                </Button>
            </Paper>
        </Container>
    );
};

export default RegisterPage;