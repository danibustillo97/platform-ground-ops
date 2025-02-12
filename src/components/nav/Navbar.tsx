"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Button,
  Box,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { CiLogout } from "react-icons/ci";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { RxHamburgerMenu } from "react-icons/rx";
import Image from "next/image";
import Link from "next/link";

interface NavbarProps {
  toggleSidebar: () => void;
  notifications: { message: string; time: string }[];
  session: any; // Ajusta el tipo según tus necesidades
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, notifications, session }) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
    handleMenuClose();
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const open = Boolean(notificationAnchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#FFFFFF",
        color: "#510C76",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        borderBottom: "2px solid #E0E0E0",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 16px",
        }}
      >
        {/* Logo */}
        <Box display="flex" alignItems="center">
          <Link href="/" passHref>
            <Box
              sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            >
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={120}
                height={40}
                priority
                style={{ borderRadius: "8px" }}
              />
            </Box>
          </Link>
        </Box>

        {/* Menu Buttons */}
        <Box display="flex" alignItems="center" gap={2}>
          {/* Notification Badge */}
          <Badge badgeContent={notifications.length} color="secondary">
            <IconButton aria-describedby={id} onClick={handleNotificationClick}>
              <NotificationsIcon
                sx={{
                  color: "#510C76",
                }}
              />
            </IconButton>
          </Badge>
          <Popover
            id={id}
            open={open}
            anchorEl={notificationAnchorEl}
            onClose={handleNotificationClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <List>
              {notifications.map((notification, index) => (
                <ListItem key={index} component="div">
                  <ListItemText primary={notification.message} secondary={notification.time} />
                </ListItem>
              ))}
            </List>
          </Popover>

          {/* Profile Menu */}
          {session && session.user ? (
            <>
              <IconButton onClick={handleMenuOpen}>
                <Avatar
                  src="https://img.freepik.com/premium-vector/avatar-icon0002_750950-43.jpg?w=200"
                  alt="User Avatar"
                  sx={{
                    backgroundColor: "#F0E6F5",
                    color: "#510C76",
                    border: "2px solid #510C76",
                  }}
                />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    minWidth: "200px",
                  },
                }}
              >
                <Box sx={{ padding: 2, textAlign: "center", color: "#510C76" }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {session.user.name}
                  </Typography>
                  <Typography variant="body2">{session.user.email}</Typography>
                </Box>
                <MenuItem
                  onClick={handleMenuClose}
                  sx={{
                    color: "#510C76",
                    "&:hover": { backgroundColor: "#F0E6F5" },
                  }}
                >
                  Activity Logs
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    color: "#510C76",
                    display: "flex",
                    justifyContent: "space-between",
                    "&:hover": { backgroundColor: "#F0E6F5" },
                  }}
                >
                  Logout <CiLogout />
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              component={Link}
              href="/login"
              sx={{
                color: "#510C76",
                border: "1px solid #510C76",
                borderRadius: "16px",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#F0E6F5",
                },
              }}
            >
              Login
            </Button>
          )}

          {/* Sidebar Toggle */}
          <IconButton
            onClick={toggleSidebar}
            sx={{
              color: "#510C76",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#F0E6F5",
              },
            }}
          >
            <RxHamburgerMenu size={24} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
