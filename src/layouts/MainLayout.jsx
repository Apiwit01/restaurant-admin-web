import { AppShell, Burger, Group, NavLink, Title, Text as MantineText, ActionIcon, useMantineColorScheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IconSun, IconMoon } from '@tabler/icons-react';

// --- Component สำหรับปุ่มสลับ Theme ---
// การประกาศ Component ไว้นอก MainLayout จะช่วยให้ไม่ต้องสร้างฟังก์ชันนี้ใหม่ทุกครั้งที่ MainLayout re-render
const ColorSchemeToggle = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <ActionIcon
      onClick={() => toggleColorScheme()}
      variant="default"
      size="lg"
      aria-label="Toggle color scheme"
    >
      {colorScheme === 'dark' ? <IconSun stroke={1.5} /> : <IconMoon stroke={1.5} />}
    </ActionIcon>
  );
}

const MainLayout = ({ children }) => {
    const [opened, { toggle }] = useDisclosure();
    const location = useLocation();
    const { logout, user } = useAuth();

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 250, breakpoint: 'sm', collapsed: { mobile: !opened } }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                    <Group>
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                        <Title order={4}>RESTAURANT ADMIN</Title>
                    </Group>
                    <Group>
                        <MantineText size="sm">Welcome, {user?.username || 'Guest'}</MantineText>
                        <ColorSchemeToggle />
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <NavLink 
                    label="Dashboard" 
                    component={Link} 
                    to="/" 
                    active={location.pathname === '/'} 
                    onClick={toggle}
                />
                <NavLink 
                    label="จัดการวัตถุดิบ" 
                    component={Link} 
                    to="/ingredients" 
                    active={location.pathname === '/ingredients'} 
                    onClick={toggle}
                />
                <NavLink 
                    label="จัดการเมนู" 
                    component={Link} 
                    to="/menus" 
                    active={location.pathname === '/menus'} 
                    onClick={toggle}
                />
                <NavLink 
                    label="ประวัติการทำอาหาร" 
                    component={Link} 
                    to="/history" 
                    active={location.pathname === '/history'} 
                    onClick={toggle}
                />
                <NavLink 
                    label="รายงาน" 
                    component={Link} 
                    to="/reports" 
                    active={location.pathname === '/reports'} 
                    onClick={toggle}
                />
                {/* mt="auto" จะดันลิงก์นี้ไปอยู่ด้านล่างสุดของ Navbar */}
                <NavLink 
                    label="ออกจากระบบ" 
                    onClick={() => {
                        logout();
                        toggle(); // ปิด Navbar หลังจากคลิก (สำหรับ mobile view)
                    }} 
                    mt="auto" 
                    color="red" 
                />
            </AppShell.Navbar>

            <AppShell.Main>
                {children}
            </AppShell.Main>
        </AppShell>
    );
}

export default MainLayout;