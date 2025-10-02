import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, TextInput, NumberInput, Select, Stack, Group, Text as MantineText } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';

const AddIngredientModal = ({ isOpen, onClose, onSuccess, initialData }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [unit, setUnit] = useState('');
    const [costPrice, setCostPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [threshold, setThreshold] = useState(0);
    const [expiryDate, setExpiryDate] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && initialData) {
            setName(initialData.name || '');
            setCategory(initialData.category || '');
            setUnit(initialData.unit || '');
            setCostPrice(initialData.cost_price || 0);
            setQuantity(initialData.quantity || 0);
            setThreshold(initialData.threshold || 0);
            setExpiryDate(initialData.expiry_date ? new Date(initialData.expiry_date) : null);
        } else {
            setName('');
            setCategory('');
            setUnit('');
            setCostPrice(0);
            setQuantity(0);
            setThreshold(0);
            setExpiryDate(null);
        }
    }, [isOpen, initialData]);

    const handleSubmit = async () => {
        setError('');
        const ingredientData = {
            name,
            category,
            unit,
            cost_price: parseFloat(costPrice),
            quantity: parseFloat(quantity),
            threshold: parseFloat(threshold),
            expiry_date: expiryDate ? dayjs(expiryDate).format('YYYY-MM-DD') : null
        };

        try {
            if (initialData) {
                await axios.put(`http://localhost:3000/api/ingredients/${initialData.ingredient_id}`, ingredientData);
            } else {
                await axios.post('http://localhost:3000/api/ingredients', ingredientData);
            }
            onSuccess();
        } catch (err) {
            setError(`Failed to save ingredient.`);
            console.error(err);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal opened={isOpen} onClose={onClose} title={initialData ? "แก้ไขวัตถุดิบ" : "เพิ่มวัตถุดิบใหม่"} size="lg">
            <Stack>
                <TextInput label="ชื่อวัตถุดิบ" value={name} onChange={(e) => setName(e.target.value)} required />
                <Select
                    label="หมวดหมู่"
                    placeholder="เลือกหมวดหมู่"
                    data={['เนื้อสัตว์', 'ผัก', 'อาหารทะเล', 'เครื่องเทศ', 'ของแห้ง', 'อื่นๆ']}
                    value={category}
                    onChange={setCategory}
                    required
                />
                <TextInput label="หน่วย" value={unit} onChange={(e) => setUnit(e.target.value)} required />
                <NumberInput label="ราคาต้นทุน (ต่อหน่วย)" value={costPrice} onChange={setCostPrice} min={0} step={0.01} precision={2} />
                <NumberInput label="ปริมาณคงเหลือ" value={quantity} onChange={setQuantity} min={0} />
                <NumberInput label="ปริมาณขั้นต่ำ" value={threshold} onChange={setThreshold} min={0} />
                <DatePickerInput
                    label="วันหมดอายุ (ถ้ามี)"
                    placeholder="เลือกวันที่"
                    value={expiryDate}
                    onChange={setExpiryDate}
                    clearable
                />
                {error && <MantineText color="red">{error}</MantineText>}
                <Group justify="flex-end" mt="xl">
                    <Button variant="default" onClick={onClose}>ยกเลิก</Button>
                    <Button onClick={handleSubmit}>{initialData ? "บันทึกการแก้ไข" : "เพิ่ม"}</Button>
                </Group>
            </Stack>
        </Modal>
    );
};

export default AddIngredientModal;