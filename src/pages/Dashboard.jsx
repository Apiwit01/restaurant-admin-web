import React, { useState, useEffect } from 'react';
import axios from 'axios';
// --- 1. แก้ไข Import โดยเปลี่ยนชื่อ Text และ Title ---
import { Container, Grid, Paper, Text as MantineText, Title as MantineTitle, Stack, Table } from '@mantine/core';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';

const StatCard = ({ title, value, color }) => (
    <Paper withBorder p="lg" radius="md" h="100%">
        <Stack>
            {/* --- 2. แก้ไขการเรียกใช้ --- */}
            <MantineText size="sm" c="dimmed">{title}</MantineText>
            <MantineTitle order={2} c={color}>{value}</MantineTitle>
        </Stack>
    </Paper>
);

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/dashboard');
                const formattedSalesData = response.data.salesLast7Days.map(d => ({
                    ...d,
                    date: dayjs(d.date).format('MMM DD'),
                }));
                setData({ ...response.data, salesLast7Days: formattedSalesData });
            } catch (err) {
                setError('Failed to fetch dashboard data.');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // --- 3. แก้ไขการเรียกใช้ ---
    if (loading) return <MantineText>Loading Dashboard...</MantineText>;
    if (error) return <MantineText color="red">{error}</MantineText>;
    if (!data) return <MantineText>No data available.</MantineText>;

    return (
        <Container size="xl">
            <Stack gap="xl">
                <MantineTitle order={2}>ภาพรวมระบบ</MantineTitle>
                <Grid>
                    <Grid.Col span={{ base: 12, md: 6, lg: 2.4 }}>
                        <StatCard title="ยอดขายทั้งหมด" value={`${Number(data.stats.total_sales).toLocaleString()} ฿`} color="blue.6" />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 2.4 }}>
                        <StatCard title="ยอดขายวันนี้" value={`${Number(data.stats.today_sales).toLocaleString()} ฿`} color="teal.6" />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 2.4 }}>
                        <StatCard title="ออเดอร์ทั้งหมด" value={data.stats.total_orders.toLocaleString()} color="violet.6" />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 2.4 }}>
                        <StatCard title="สินค้าใกล้หมด" value={`${data.stats.low_stock_count} รายการ`} color="orange.6" />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6, lg: 2.4 }}>
                        <StatCard title="เมนูขายดีวันนี้" value={data.stats.best_seller_today} color="pink.6" />
                    </Grid.Col>
                </Grid>

                <Paper withBorder p="lg" radius="md">
                    <MantineTitle order={4} mb="md">ยอดขาย 7 วันล่าสุด (บาท)</MantineTitle>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.salesLast7Days}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip formatter={(value) => `${Number(value).toLocaleString()} ฿`} />
                            <Legend />
                            <Bar dataKey="sales" name="ยอดขาย" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </Paper>

                <Paper withBorder p="lg" radius="md">
                    <MantineTitle order={4} mb="md">รายการสินค้าใกล้หมด (5 อันดับแรก)</MantineTitle>
                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr><Table.Th>ชื่อสินค้า</Table.Th><Table.Th>จำนวนคงเหลือ</Table.Th><Table.Th>หน่วย</Table.Th></Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {data.lowStockItems.length > 0 ? data.lowStockItems.map((item, index) => (
                                <Table.Tr key={index}><Table.Td>{item.name}</Table.Td><Table.Td>{item.quantity}</Table.Td><Table.Td>{item.unit}</Table.Td></Table.Tr>
                            )) : (
                                <Table.Tr><Table.Td colSpan={3} ta="center">ไม่มีสินค้าใกล้หมด</Table.Td></Table.Tr>
                            )}
                        </Table.Tbody>
                    </Table>
                </Paper>
            </Stack>
        </Container>
    );
};

export default Dashboard;