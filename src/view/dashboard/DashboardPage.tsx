"use client"
import React from 'react';
import { Container, Grid, Paper, Typography, Box, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, CssBaseline } from '@mui/material';
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const drawerWidth = 240;

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const Dashboard = () => {
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />


        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              {/* Chart */}
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  <Chart />
                </Paper>
              </Grid>
              {/* Recent Deposits */}
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  <Deposits />
                </Paper>
              </Grid>
              {/* Recent Orders */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  <Orders />
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

function Chart() {
  return <Typography>Chart</Typography>;
}

function Deposits() {
  return <Typography>Deposits</Typography>;
}

function Orders() {
  return <Typography>Orders</Typography>;
}

export default Dashboard;
