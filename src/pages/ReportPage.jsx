import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
// --- 1. Import SimpleGrid และ ThemeIcon เพิ่ม ---
import { Container, Stack, Title, Paper, Group, Button, Text, Center, SimpleGrid, ThemeIcon } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { IconPrinter, IconSum, IconToolsKitchen2, IconTrendingUp } from '@tabler/icons-react';
import './ReportPage.css';

// --- 2. สร้าง Component สำหรับการ์ดสรุปข้อมูล ---
const StatCard = ({ title, value, icon, color }) => (
    <Paper withBorder p="md" radius="md">
        <Group>
            <ThemeIcon color={color} variant="light" size={38} radius="md">
                {icon}
            </ThemeIcon>
            <Stack gap={0}>
                <Text size="xs" c="dimmed">{title}</Text>
                <Text fw={700} size="lg">{value}</Text>
            </Stack>
        </Group>
    </Paper>
);

const ReportPage = () => {
    const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'day').toDate(), new Date()]);
    const [usageData, setUsageData] = useState([]);
    const [costData, setCostData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // --- 3. สร้าง state สำหรับเก็บข้อมูลสรุป ---
    const [summary, setSummary] = useState(null);

    const fetchReports = async () => {
        if (!dateRange || !dateRange[0] || !dateRange[1]) {
            setError('กรุณาเลือกช่วงวันที่เริ่มต้นและสิ้นสุด');
            return;
        }
        try {
            setLoading(true);
            setError(null);
            setUsageData([]);
            setCostData([]);
            setSummary(null); // เคลียร์ข้อมูลสรุปเก่า

            const params = {
                startDate: dayjs(dateRange[0]).format('YYYY-MM-DD'),
                endDate: dayjs(dateRange[1]).format('YYYY-MM-DD')
            };
            const [usageResponse, costResponse] = await Promise.all([
                axios.get('http://localhost:3000/api/reports/usage-trends', { params }),
                axios.get('http://localhost:3000/api/reports/cost-summary', { params })
            ]);

            const formattedUsageData = usageResponse.data.map(d => ({ ...d, date: dayjs(d.date).format('DD/MM') }));
            setUsageData(formattedUsageData);
            setCostData(costResponse.data);

            // --- 4. คำนวณค่าสรุปจากข้อมูลที่ได้มา (ชั่วคราว) ---
            const totalCost = costResponse.data.reduce((sum, item) => sum + parseFloat(item.total_cost), 0);
            const mostUsedIngredient = costResponse.data.length > 0 
                ? costResponse.data.reduce((prev, current) => (prev.total_cost > current.total_cost) ? prev : current)
                : { ingredient_name: '-' };
            const totalUsageDays = usageResponse.data.length;

            setSummary({
                totalCost: totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                mostUsedIngredient: mostUsedIngredient.ingredient_name,
                totalUsageDays: `${totalUsageDays} วัน`
            });
            // ---------------------------------------------

        } catch (err) {
            setError('Failed to fetch report data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const renderNoData = (message) => (
        <Center h={300}><Text c="dimmed">{loading ? 'กำลังโหลดข้อมูล...' : message}</Text></Center>
    );

    return (
        <Container size="lg">
            <Stack gap="xl" id="report-content">
                <Group justify="space-between" className="report-controls">
                    <Title order={2}>รายงานสรุป</Title>
                    <Button leftSection={<IconPrinter size={16} />} variant="default" onClick={() => window.print()}>พิมพ์รายงาน</Button>
                </Group>
                
                <Paper withBorder p="md" radius="md" className="report-controls">
                    <Group>
                        <DatePickerInput type="range" label="เลือกช่วงวันที่สำหรับรายงาน" placeholder="เลือกช่วงวันที่" value={dateRange} onChange={setDateRange} style={{ flex: 1 }} />
                        <Button onClick={fetchReports} loading={loading} mt="25px">สร้างรายงาน</Button>
                    </Group>
                </Paper>

                {error && <Text color="red">{error}</Text>}

                {/* --- 5. แสดงส่วนสรุปข้อมูล --- */}
                {summary && (
                     <Paper withBorder p="md" radius="md" className="report-section">
                        <Title order={4} mb="md">ข้อมูลสรุปช่วงวันที่ {dayjs(dateRange[0]).format('D MMM YY')} - {dayjs(dateRange[1]).format('D MMM YY')}</Title>
                        <SimpleGrid cols={{ base: 1, sm: 3 }}>
                            <StatCard title="ค่าใช้จ่ายวัตถุดิบทั้งหมด" value={`${summary.totalCost} ฿`} icon={<IconSum size={22} />} color="green" />
                            <StatCard title="วัตถุดิบที่ใช้เยอะที่สุด" value={summary.mostUsedIngredient} icon={<IconToolsKitchen2 size={22} />} color="orange" />
                            <StatCard title="จำนวนวันที่มีการใช้งาน" value={summary.totalUsageDays} icon={<IconTrendingUp size={22} />} color="blue" />
                        </SimpleGrid>
                    </Paper>
                )}
                
                <Paper withBorder p="md" radius="md" className="report-section">
                    <Title order={4} mb="md">แนวโน้มการใช้วัตถุดิบ (หน่วย)</Title>
                    {usageData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}><LineChart data={usageData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="total_usage" name="จำนวนที่ใช้ (หน่วย)" stroke="#8884d8" /></LineChart></ResponsiveContainer>
                    ) : (
                        renderNoData('ไม่มีข้อมูลการใช้งานในช่วงวันที่ที่เลือก')
                    )}
                </Paper>

                <Paper withBorder p="md" radius="md" className="report-section">
                    <Title order={4} mb="md">สรุปค่าใช้จ่ายวัตถุดิบ (บาท)</Title>
                    {costData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}><BarChart data={costData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="ingredient_name" angle={-45} textAnchor="end" height={100} interval={0} /><YAxis /><Tooltip formatter={(value) => `${Number(value).toLocaleString()} ฿`} /><Legend /><Bar dataKey="total_cost" name="ค่าใช้จ่ายทั้งหมด (บาท)" fill="#82ca9d" /></BarChart></ResponsiveContainer>
                    ) : (
                        renderNoData('ไม่มีข้อมูลค่าใช้จ่ายในช่วงวันที่ที่เลือก')
                    )}
                </Paper>
            </Stack>
        </Container>
    );
};

export default ReportPage;