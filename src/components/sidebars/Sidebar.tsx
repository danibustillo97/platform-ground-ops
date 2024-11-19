import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import {
  FaHome,
  FaUserCog,
} from "react-icons/fa";
import {
  LuBaggageClaim,
} from "react-icons/lu";
import {
  MdOutlineFlight,
  MdExpandMore,
  MdExpandLess,
} from "react-icons/md";
import { GrLinkTop } from "react-icons/gr";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();
  const [openSubmenus, setOpenSubmenus] = React.useState<{ [key: string]: boolean }>({});

  const toggleSubmenu = (key: string) => {
    setOpenSubmenus((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: <FaHome /> },
    {
      href: "/users",
      label: "Usuarios",
      icon: <FaUserCog />,
      submenu: [
        { href: "/users/roles", label: "Roles" },
      ],
    },
    {
      href: "/baggage_gestion",
      label: "Equipaje",
      icon: <LuBaggageClaim />,
      submenu: [],
    },
    {
      href: "/flights",
      label: "Vuelos",
      icon: <MdOutlineFlight />,
      submenu: [],
    },
  ];

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={toggleSidebar}
      sx={{
        width: 250,
        "& .MuiDrawer-paper": {
          width: 250,
          boxSizing: "border-box",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", padding: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Menú
        </Typography>
        <IconButton onClick={toggleSidebar}>
          <GrLinkTop />
        </IconButton>
      </Box>
      <List>
        {links.map((link, index) => (
          <React.Fragment key={index}>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href={link.href}
                selected={pathname === link.href}
                sx={{
                  "&.Mui-selected": { backgroundColor: "primary.main", color: "white" },
                  "&.Mui-selected:hover": { backgroundColor: "primary.dark" },
                }}
              >
                <ListItemIcon>{link.icon}</ListItemIcon>
                <ListItemText primary={link.label} />
                {link.submenu && link.submenu.length > 0 && (
                  <IconButton
                    onClick={(e) => {
                      e.preventDefault();
                      toggleSubmenu(link.href);
                    }}
                    size="small"
                  >
                    {openSubmenus[link.href] ? <MdExpandLess /> : <MdExpandMore />}
                  </IconButton>
                )}
              </ListItemButton>
            </ListItem>
            {link.submenu && link.submenu.length > 0 && (
              <Collapse in={openSubmenus[link.href]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {link.submenu.map((subLink, subIndex) => (
                    <ListItem key={subIndex} disablePadding>
                      <ListItemButton
                        component={Link}
                        href={subLink.href}
                        selected={pathname === subLink.href}
                        sx={{
                          pl: 4,
                          "&.Mui-selected": { backgroundColor: "primary.light", color: "white" },
                          "&.Mui-selected:hover": { backgroundColor: "primary.main" },
                        }}
                      >
                        <ListItemText primary={subLink.label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
