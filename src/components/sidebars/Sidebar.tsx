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
  Divider,
} from "@mui/material";
import { FaHome, FaUserCog } from "react-icons/fa";
import { LuBaggageClaim } from "react-icons/lu";
import { MdOutlineFlight, MdExpandMore, MdExpandLess } from "react-icons/md";
import { GrClose } from "react-icons/gr";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();
  const [openSubmenus, setOpenSubmenus] = React.useState<{
    [key: string]: boolean;
  }>({});

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
      submenu: [{ href: "/users/roles", label: "Roles" }],
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
        "& .MuiDrawer-paper": {
          width: 200,
          boxSizing: "border-box",
          backgroundColor: "#FFFFFF",
          borderRadius: "0 16px 16px 0",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 2,
          backgroundColor: "#F8F9FA",
          borderRadius: "0 16px 0 0",
          borderBottom: "1px solid #E0E0E0",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "#510C76", letterSpacing: 1 }}
        >
          Menú
        </Typography>
        <IconButton onClick={toggleSidebar} sx={{ color: "#510C76" }}>
          <GrClose />
        </IconButton>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <List>
          {links.map((link, index) => (
            <React.Fragment key={index}>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href={link.href}
                  selected={pathname === link.href}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#F0E6F5",
                      color: "#510C76",
                      fontWeight: "bold",
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: "#E0D3EB",
                    },
                    margin: "4px 12px",
                    borderRadius: "8px",
                    transition: "background-color 0.3s ease",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: pathname === link.href ? "#510C76" : "#9E9E9E",
                      minWidth: 36,
                    }}
                  >
                    {link.icon}
                  </ListItemIcon>
                  <ListItemText primary={link.label} />
                  {link.submenu && link.submenu.length > 0 && (
                    <IconButton
                      onClick={(e) => {
                        e.preventDefault();
                        toggleSubmenu(link.href);
                      }}
                      size="small"
                      sx={{ color: "#510C76" }}
                    >
                      {openSubmenus[link.href] ? (
                        <MdExpandLess />
                      ) : (
                        <MdExpandMore />
                      )}
                    </IconButton>
                  )}
                </ListItemButton>
              </ListItem>
              {link.submenu && link.submenu.length > 0 && (
                <Collapse
                  in={openSubmenus[link.href]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {link.submenu.map((subLink, subIndex) => (
                      <ListItem key={subIndex} disablePadding>
                        <ListItemButton
                          component={Link}
                          href={subLink.href}
                          selected={pathname === subLink.href}
                          sx={{
                            pl: 4,
                            "&.Mui-selected": {
                              backgroundColor: "#F0E6F5",
                              color: "#510C76",
                              fontWeight: "bold",
                            },
                            "&.Mui-selected:hover": {
                              backgroundColor: "#E0D3EB",
                            },
                            margin: "2px 12px",
                            borderRadius: "8px",
                            transition: "background-color 0.3s ease",
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
      </Box>

      {/* Footer */}
      <Box
        sx={{
          textAlign: "center",
          padding: 2,
          color: "#510C76",
          borderTop: "1px solid #E0E0E0",
        }}
      >
        <Typography variant="body2">© 2024 ARAJET</Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
