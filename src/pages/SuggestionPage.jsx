import React, { useState, useEffect } from 'react';
import { Container, Table, Title, Stack, Text as MantineText, Button, Group } from '@mantine/core';
import axiosInstance from '../api/axiosConfig';
import { IconPrinter } from '@tabler/icons-react';

const SuggestionPage = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const response = await axiosInstance.get('/api/suggestions/purchase-order');
                setSuggestions(response.data);
            } catch (err) {
                setError('Failed to fetch suggestions. Only Admin or Manager can view this page.');
            } finally {
                setLoading(false);
            }
        };
        fetchSuggestions();
    }, []);

    const rows = suggestions.map((item) => (
        <Table.Tr key={item.ingredient_id}>
            <Table.Td>{item.name}</Table.Td>
            <Table.Td>{item.quantity}</Table.Td>
            <Table.Td>{item.threshold}</Table.Td>
            <Table.Td c="blue.6" fw={700}>{item.suggested_quantity}</Table.Td>
            <Table.Td>{Number(item.estimated_cost).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Table.Td>
        </Table.Tr>
    ));

    if (loading) return <MantineText>Loading suggestions...</MantineText>;
    if (error) return <MantineText color="red">{error}</MantineText>;

    return (
        <Container size="lg">
            <Stack gap="lg">
                <Group justify="space-between">
                    <Title order={2}>ใบสั่งซื้อแนะนำ</Title>
                    <Button leftSection={<IconPrinter size={14} />} onClick={() => window.print()}>พิมพ์รายงาน</Button>
                </Group>
                <Table striped highlightOnHover withTableBorder>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>วัตถุดิบ</Table.Th>
                            <Table.Th>คงเหลือ</Table.Th>
                            <Table.Th>จุดสั่งซื้อ</Table.Th>
                            <Table.Th>จำนวนที่แนะนำให้สั่ง</Table.Th>
                            <Table.Th>ราคาประเมิน (บาท)</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows.length > 0 ? rows : (
                        <Table.Tr><Table.Td colSpan={5} ta="center">ไม่มีวัตถุดิบที่ต้องสั่งซื้อในขณะนี้</Table.Td></Table.Tr>
                    )}</Table.Tbody>
                </Table>
            </Stack>
        </Container>
    );
};

export default SuggestionPage;