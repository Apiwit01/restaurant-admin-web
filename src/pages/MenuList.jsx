import React, { useState, useEffect } from 'react';
import axios from 'axios';
// --- 1. แก้ไข/เพิ่ม imports จาก Mantine ---
import { 
    Container, 
    SimpleGrid, 
    Card, 
    Image, 
    Text as MantineText, 
    Button, 
    Group, 
    Title, 
    Stack, 
    AspectRatio,
    Paper,
    useMantineTheme // Hook สำหรับเข้าถึงค่า theme
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks'; // Hook สำหรับตรวจจับขนาดหน้าจอ
import AddEditMenuModal from '../components/AddEditMenuModal';

const MenuList = () => {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMenu, setEditingMenu] = useState(null);

    // --- 2. เพิ่ม Hook เพื่อเช็คว่าเป็นหน้าจอมือถือหรือไม่ ---
    const theme = useMantineTheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

    const handleAddClick = () => {
        setEditingMenu(null);
        setIsModalOpen(true);
    };
    const handleEditClick = (menu) => {
        setEditingMenu(menu);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingMenu(null);
    };

    const fetchMenus = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3000/api/menus');
            setMenus(response.data);
        } catch (err) {
            setError('Failed to fetch menus.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenus();
    }, []);

    const handleDelete = async (menuId) => {
        if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบเมนูนี้?')) {
            try {
                await axios.delete(`http://localhost:3000/api/menus/${menuId}`);
                fetchMenus();
            } catch (err) {
                alert('Failed to delete menu.');
            }
        }
    };
    
    if (loading) return <MantineText>Loading...</MantineText>;
    if (error) return <MantineText color="red">{error}</MantineText>;

    // --- 3. สร้าง View สำหรับ Desktop (โค้ดเดิมของคุณ) ---
    const desktopView = (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
            {menus.map((menu) => (
                <Card key={menu.menu_id} shadow="sm" padding="lg" radius="md" withBorder>
                    <Card.Section>
                        <AspectRatio ratio={16 / 9}>
                            <Image
                                src={menu.image_url 
                                    ? `http://localhost:3000/${menu.image_url.replace(/\\/g, '/')}` 
                                    : `https://placehold.co/600x400?text=No+Image`
                                }
                                alt={menu.name}
                            />
                        </AspectRatio>
                    </Card.Section>
                    <Group justify="space-between" mt="md" mb="xs">
                        <MantineText fw={500}>{menu.name}</MantineText>
                    </Group>
                    <MantineText size="sm" c="dimmed">
                        ราคา: {Number(menu.price).toLocaleString()} ฿
                    </MantineText>
                    <Group justify="flex-end" mt="md">
                         <Button variant="light" color="blue" onClick={() => handleEditClick(menu)}>แก้ไข</Button>
                         <Button variant="light" color="red" onClick={() => handleDelete(menu.menu_id)}>ลบ</Button>
                    </Group>
                </Card>
            ))}
        </SimpleGrid>
    );

    // --- 4. สร้าง View สำหรับ Mobile (รูปแบบรายการ) ---
    const mobileView = (
        <Stack gap="md">
            {menus.map((menu) => (
                <Paper key={menu.menu_id} p="md" withBorder radius="md" shadow="sm">
                    <Group>
                        <Image
                            src={menu.image_url 
                                ? `http://localhost:3000/${menu.image_url.replace(/\\/g, '/')}` 
                                : `https://placehold.co/150x150?text=No+Image`
                            }
                            alt={menu.name}
                            radius="sm"
                            w={80} // กำหนดขนาดรูปให้เล็กลง
                            h={80}
                            fit="cover"
                        />
                        <Stack gap="xs" style={{ flex: 1 }}>
                            <MantineText fw={500}>{menu.name}</MantineText>
                            <MantineText size="sm" c="dimmed">
                                ราคา: {Number(menu.price).toLocaleString()} ฿
                            </MantineText>
                            <Group justify="flex-end" mt="xs">
                                <Button size="xs" variant="light" color="blue" onClick={() => handleEditClick(menu)}>แก้ไข</Button>
                                <Button size="xs" variant="light" color="red" onClick={() => handleDelete(menu.menu_id)}>ลบ</Button>
                            </Group>
                        </Stack>
                    </Group>
                </Paper>
            ))}
        </Stack>
    );

    return (
        <>
            <Container size="lg">
                <Stack gap="lg">
                    <Group justify="space-between">
                        <Title order={2}>จัดการเมนู</Title>
                        <Button onClick={handleAddClick}>เพิ่มเมนูใหม่</Button>
                    </Group>
                    
                    {/* --- 5. เลือกว่าจะแสดง View ไหน โดยเช็คจาก isMobile --- */}
                    {isMobile ? mobileView : desktopView}

                </Stack>
            </Container>
            <AddEditMenuModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                onSuccess={() => { handleCloseModal(); fetchMenus(); }} 
                initialData={editingMenu} 
            />
        </>
    );
};

export default MenuList;