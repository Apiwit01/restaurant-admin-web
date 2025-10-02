import React, { useState, useEffect } from 'react';
import axios from 'axios';
// --- แก้ไขบรรทัดนี้ ---
import { Container, Table, Title, Stack, Group, Text as MantineText, Paper } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';

const CookingHistory = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState([null, null]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const params = {};
                if (dateRange[0]) params.startDate = dayjs(dateRange[0]).format('YYYY-MM-DD');
                if (dateRange[1]) params.endDate = dayjs(dateRange[1]).format('YYYY-MM-DD');
                const response = await axios.get('http://localhost:3000/api/history', { params });
                setLogs(response.data);
            } catch (err) {
                setError('Failed to fetch cooking history.');
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [dateRange]);

    const rows = logs.map((log) => (
        <Table.Tr key={log.log_id}>
            <Table.Td>{dayjs(log.cooked_at).format('DD MMMM YYYY, HH:mm')}</Table.Td>
            <Table.Td>{log.menu_name}</Table.Td>
            <Table.Td>{log.quantity}</Table.Td>
            <Table.Td>{log.user_name}</Table.Td>
        </Table.Tr>
    ));
    // --- แก้ไขการเรียกใช้ Text ทั้งหมด ---
    return (
        <Container size="lg">
            <Stack>
                <Title order={2} mb="lg">ประวัติการทำอาหาร</Title>
                <Paper withBorder p="md" radius="md">
                    <Group>
                        <DatePickerInput type="range" label="กรองตามช่วงวันที่" placeholder="เลือกช่วงวันที่" value={dateRange} onChange={setDateRange} clearable style={{ flex: 1 }} />
                    </Group>
                </Paper>
                {loading && <MantineText>Loading...</MantineText>}
                {error && <MantineText color="red">{error}</MantineText>}
                {!loading && !error && (
                    <Table striped highlightOnHover withTableBorder withColumnBorders>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>วันที่และเวลา</Table.Th>
                                <Table.Th>เมนูที่ทำ</Table.Th>
                                <Table.Th>จำนวน (จาน)</Table.Th>
                                <Table.Th>ผู้ใช้งาน</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows.length > 0 ? rows : (
                            <Table.Tr><Table.Td colSpan={4} align="center">ไม่พบข้อมูล</Table.Td></Table.Tr>
                        )}</Table.Tbody>
                    </Table>
                )}
            </Stack>
        </Container>
    );
};

export default CookingHistory;