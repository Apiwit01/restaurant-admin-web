import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, TextInput, NumberInput, Select, SimpleGrid, Card, Text as MantineText, ActionIcon, Stack, Group, FileInput } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';

const AddEditMenuModal = ({ isOpen, onClose, onSuccess, initialData }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [imageFile, setImageFile] = useState(null);
    const [allIngredients, setAllIngredients] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [ingredientAmount, setIngredientAmount] = useState(0);
    const [recipeItems, setRecipeItems] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            axios.get('http://localhost:3000/api/ingredients')
                .then(response => {
                    const ingredientOptions = response.data.map(ing => ({
                        value: ing.ingredient_id.toString(),
                        label: `${ing.name} (${ing.unit})`
                    }));
                    setAllIngredients(ingredientOptions);
                });
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && initialData) {
            setName(initialData.name);
            setPrice(initialData.price);
            setImageFile(null); // เคลียร์ไฟล์ที่เลือกไว้ก่อนหน้า
            axios.get(`http://localhost:3000/api/menus/${initialData.menu_id}`)
                .then(response => {
                    setRecipeItems(response.data.ingredients || []);
                });
        } else {
            setName('');
            setPrice(0);
            setImageFile(null);
            setRecipeItems([]);
        }
    }, [isOpen, initialData]);

    const handleAddRecipeItem = () => {
        if (!selectedIngredient || ingredientAmount <= 0) return alert("กรุณาเลือกวัตถุดิบและใส่ปริมาณที่ถูกต้อง");
        const ingredient = allIngredients.find(ing => ing.value === selectedIngredient);
        if (recipeItems.find(item => item.ingredient_id === parseInt(selectedIngredient))) return alert("วัตถุดิบนี้ถูกเพิ่มในสูตรแล้ว");
        setRecipeItems([...recipeItems, {
            ingredient_id: parseInt(selectedIngredient),
            name: ingredient.label,
            amount: ingredientAmount,
            unit: ingredient.label.match(/\(([^)]+)\)/)[1]
        }]);
    };

    const handleRemoveRecipeItem = (id) => {
        setRecipeItems(recipeItems.filter(item => item.ingredient_id !== id));
    };

    const handleSubmit = async () => {
        setError('');
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('ingredients', JSON.stringify(
            recipeItems.map(({ ingredient_id, amount, unit }) => ({ ingredient_id, amount, unit }))
        ));
        if (imageFile) {
            formData.append('image', imageFile);
        } else if (initialData && initialData.image_url) {
            formData.append('existing_image_url', initialData.image_url);
        }

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            if (initialData) {
                await axios.put(`http://localhost:3000/api/menus/${initialData.menu_id}`, formData, config);
            } else {
                await axios.post('http://localhost:3000/api/menus', formData, config);
            }
            onSuccess();
            onClose();
        } catch (err) {
            setError(`Failed to save menu.`);
            console.error(err);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal opened={isOpen} onClose={onClose} title={initialData ? "แก้ไขเมนู" : "เพิ่มเมนูใหม่"} size="lg">
            <Stack>
                <TextInput label="ชื่อเมนู" value={name} onChange={(e) => setName(e.target.value)} required />
                <NumberInput label="ราคา" value={price} onChange={setPrice} min={0} required />
                <FileInput
                    label="รูปภาพเมนู"
                    placeholder="เลือกไฟล์รูปภาพใหม่ (ถ้าต้องการเปลี่ยน)"
                    value={imageFile}
                    onChange={setImageFile}
                    accept="image/png,image/jpeg"
                />

                {/* --- ส่วนของสูตรอาหารที่หายไป --- */}
                <MantineText fw={500} mt="md">สูตรอาหาร</MantineText>
                <SimpleGrid cols={3}>
                    <Select
                        label="เลือกวัตถุดิบ"
                        placeholder="เลือกวัตถุดิบ"
                        data={allIngredients}
                        value={selectedIngredient}
                        onChange={setSelectedIngredient}
                        searchable
                    />
                    <NumberInput label="ปริมาณ" value={ingredientAmount} onChange={setIngredientAmount} min={0} />
                    <Button onClick={handleAddRecipeItem} mt="25px">เพิ่มลงสูตร</Button>
                </SimpleGrid>

                <Stack gap="xs" mt="md">
                    <MantineText size="sm" c="dimmed">วัตถุดิบในสูตรตอนนี้:</MantineText>
                    {recipeItems.length === 0 && <MantineText size="sm">ยังไม่มีวัตถุดิบในสูตร</MantineText>}
                    {recipeItems.map(item => (
                        <Card withBorder padding="xs" key={item.ingredient_id}>
                           <Group justify="space-between">
                                <MantineText>{item.name} {item.amount} {item.unit}</MantineText>
                                <ActionIcon color="red" onClick={() => handleRemoveRecipeItem(item.ingredient_id)}><IconTrash size={16} /></ActionIcon>
                           </Group>
                        </Card>
                    ))}
                </Stack>
                {/* --- สิ้นสุดส่วนที่หายไป --- */}

                {error && <MantineText color="red">{error}</MantineText>}
                <Group justify="flex-end" mt="xl">
                    <Button variant="default" onClick={onClose}>ยกเลิก</Button>
                    <Button onClick={handleSubmit}>{initialData ? "บันทึกการแก้ไข" : "เพิ่มเมนู"}</Button>
                </Group>
            </Stack>
        </Modal>
    );
};

export default AddEditMenuModal;