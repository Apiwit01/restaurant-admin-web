import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Group, Title, Container, Badge, ActionIcon, Stack, Text as MantineText, Tabs } from '@mantine/core';
import { IconPencil, IconTrash, IconAlertTriangle } from '@tabler/icons-react';
import AddIngredientModal from '../components/AddIngredientModal';
import dayjs from 'dayjs';

const IngredientList = () => {
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIngredient, setEditingIngredient] = useState(null);
    const [activeTab, setActiveTab] = useState('ทั้งหมด');

    const handleEditClick = (ingredient) => {
        setEditingIngredient(ingredient);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingIngredient(null);
    };

    const fetchIngredients = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3000/api/ingredients', {
                params: { category: activeTab }
            });
            setIngredients(response.data);
        } catch (err) {
            setError('Failed to fetch ingredients.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIngredients();
    }, [activeTab]);

    const handleSuccess = () => {
        fetchIngredients();
        handleCloseModal();
    };

    const handleDelete = async (ingredientId) => {
        if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบวัตถุดิบนี้?')) {
            try {
                await axios.delete(`http://localhost:3000/api/ingredients/${ingredientId}`);
                fetchIngredients();
            } catch (err) {
                alert('Failed to delete ingredient.');
            }
        }
    };

    if (error) return <MantineText color="red">{error}</MantineText>;

    const rows = ingredients.map((item) => {
        const isExpiringSoon = item.expiry_date && dayjs(item.expiry_date).isBefore(dayjs().add(7, 'day'));
        return (
            <Table.Tr key={item.ingredient_id}>
                <Table.Td>{item.name}</Table.Td>
                <Table.Td>{item.category}</Table.Td>
                <Table.Td>{item.unit}</Table.Td>
                <Table.Td>{item.quantity}</Table.Td>
                <Table.Td>
                    {item.expiry_date ? dayjs(item.expiry_date).format('DD MMM YYYY') : '-'}
                    {isExpiringSoon && <IconAlertTriangle size={16} color="orange" style={{ marginLeft: 8, verticalAlign: 'middle' }} title="ใกล้หมดอายุใน 7 วัน" />}
                </Table.Td>
                <Table.Td>
                    <Badge color={item.quantity > item.threshold ? 'teal' : 'yellow'} variant="light">
                        {item.quantity > item.threshold ? 'ปกติ' : 'ใกล้หมด'}
                    </Badge>
                </Table.Td>
                <Table.Td>
                    <Group gap="sm">
                        <ActionIcon variant="subtle" color="gray" onClick={() => handleEditClick(item)}><IconPencil size={16} /></ActionIcon>
                        <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(item.ingredient_id)}><IconTrash size={16} /></ActionIcon>
                    </Group>
                </Table.Td>
            </Table.Tr>
        );
    });

    return (
        <Container size="xl">
            <Stack gap="lg">
                <Group justify="space-between">
                    <Title order={2}>จัดการวัตถุดิบ</Title>
                    <Button onClick={() => { setEditingIngredient(null); setIsModalOpen(true); }}>เพิ่มวัตถุดิบใหม่</Button>
                </Group>
                
                <Tabs value={activeTab} onChange={setActiveTab}>
                    <Tabs.List>
                        <Tabs.Tab value="ทั้งหมด">ทั้งหมด</Tabs.Tab>
                        <Tabs.Tab value="เนื้อสัตว์">เนื้อสัตว์</Tabs.Tab>
                        <Tabs.Tab value="ผัก">ผัก</Tabs.Tab>
                        <Tabs.Tab value="อาหารทะเล">อาหารทะเล</Tabs.Tab>
                        <Tabs.Tab value="เครื่องเทศ">เครื่องเทศ</Tabs.Tab>
                        <Tabs.Tab value="ของแห้ง">ของแห้ง</Tabs.Tab>
                        <Tabs.Tab value="อื่นๆ">อื่นๆ</Tabs.Tab>
                    </Tabs.List>
                </Tabs>

                {loading ? <MantineText>Loading...</MantineText> : (
                    <Table striped highlightOnHover withTableBorder>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>ชื่อวัตถุดิบ</Table.Th>
                                <Table.Th>หมวดหมู่</Table.Th>
                                <Table.Th>หน่วย</Table.Th>
                                <Table.Th>คงเหลือ</Table.Th>
                                <Table.Th>วันหมดอายุ</Table.Th>
                                <Table.Th>สถานะ</Table.Th>
                                <Table.Th>จัดการ</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows.length > 0 ? rows : (
                            <Table.Tr><Table.Td colSpan={7} ta="center">ไม่พบข้อมูลในหมวดหมู่นี้</Table.Td></Table.Tr>
                        )}</Table.Tbody>
                    </Table>
                )}
            </Stack>
            
            <AddIngredientModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSuccess={handleSuccess}
                initialData={editingIngredient}
            />
        </Container>
    );
};

export default IngredientList;