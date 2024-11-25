"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Avatar,
  Divider,
} from "@mui/material";
import { Chart } from "primereact/chart";
import NotificationsIcon from "@mui/icons-material/Notifications";
import InboxIcon from "@mui/icons-material/Inbox";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

interface Baggage {
  status: string;
}

interface Message {
  id: number;
  subject: string;
  sender: string;
  time: string;
  content: string;
}

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [baggageData, setBaggageData] = useState<Baggage[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setBaggageData([
        { status: "Abierto" },
        { status: "Recuperado" },
        { status: "En Proceso" },
        { status: "Perdido" },
        { status: "Recuperado" },
        { status: "En Proceso" },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    setMessages([
      {
        id: 1,
        subject: "Asunto 1",
        sender: "Usuario A",
        time: "10:00 AM",
        content: "Contenido del mensaje 1",
      },
      {
        id: 2,
        subject: "Asunto 2",
        sender: "Usuario B",
        time: "10:30 AM",
        content: "Contenido del mensaje 2",
      },
      {
        id: 3,
        subject: "Asunto 3",
        sender: "Usuario C",
        time: "11:00 AM",
        content: "Contenido del mensaje 3",
      },
    ]);
  }, []);

  const statusCounts = {
    Abierto: baggageData.filter((baggage) => baggage.status === "Abierto")
      .length,
    Recuperado: baggageData.filter((baggage) => baggage.status === "Recuperado")
      .length,
    "En Proceso": baggageData.filter(
      (baggage) => baggage.status === "En Proceso"
    ).length,
    Perdido: baggageData.filter((baggage) => baggage.status === "Perdido")
      .length,
  };

  const chartColors = ["#510C76", "#D2A8E0", "#8753A1", "#4C2A59"];
  const chartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: "Conteo por Estado",
        data: Object.values(statusCounts),
        backgroundColor: chartColors,
        hoverBackgroundColor: chartColors.map((color) => `${color}AA`),
      },
    ],
  };

  const lineChartData = {
    labels: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
    ],
    datasets: [
      {
        label: "Recuperaciones",
        data: [5, 10, 15, 20, 25, 30, 35, 40],
        borderColor: "#510C76",
        backgroundColor: "#510C7680",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: { display: false },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      padding={3}
      bgcolor="#f9f9f9"
    >
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding={2}
        bgcolor="#510C76"
        color="white"
        borderRadius={2}
        boxShadow={3}
      >
        <Typography variant="h5" fontWeight="bold">
          Dashboard
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton sx={{ color: "white" }}>
            <NotificationsIcon />
          </IconButton>
          <Avatar sx={{ bgcolor: "#8753A1" }}>DB</Avatar>
        </Box>
      </Box>

      {/* Main Content */}
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexGrow={1}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box flexGrow={1} marginTop={3}>
          <Grid container spacing={3}>
            {/* Status Cards */}
            {Object.entries(statusCounts).map(([status, count]) => (
              <Grid item xs={12} sm={6} md={3} key={status}>
                <Card
                  elevation={3}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: "#F4E6FA",
                    borderLeft: `5px solid ${
                      status === "Abierto"
                        ? "#D2A8E0"
                        : status === "Recuperado"
                        ? "#510C76"
                        : status === "En Proceso"
                        ? "#8753A1"
                        : "#4C2A59"
                    }`,
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      {status === "Abierto" && <ErrorIcon color="error" />}
                      {status === "Recuperado" && (
                        <CheckCircleIcon color="success" />
                      )}
                      {status === "En Proceso" && (
                        <HourglassEmptyIcon color="warning" />
                      )}
                      {status === "Perdido" && <TrendingUpIcon color="info" />}
                      <Typography
                        variant="h6"
                        color="textPrimary"
                        fontWeight="bold"
                      >
                        {status}
                      </Typography>
                    </Box>
                    <Typography
                      variant="h4"
                      color="#510C76"
                      fontWeight="bold"
                      mt={1}
                    >
                      {count}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {/* Charts */}
            <Grid item xs={12} md={8}>
              <Card elevation={3} sx={{ borderRadius: 2, height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Distribución de Estados
                  </Typography>
                  <Box height={300}>
                    <Chart
                      type="doughnut"
                      data={chartData}
                      options={chartOptions}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card elevation={3} sx={{ borderRadius: 2, height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Recuperaciones Mensuales
                  </Typography>
                  <Box height={300}>
                    <Chart
                      type="line"
                      data={lineChartData}
                      options={chartOptions}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Messages Section */}
            <Grid item xs={12}>
              <Card elevation={3} sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Notificaciones y Mensajes
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography fontWeight="bold">Notificaciones</Typography>
                      <List>
                        <ListItem>
                          <NotificationsIcon sx={{ marginRight: 2 }} />
                          <ListItemText primary="Nueva alerta" />
                        </ListItem>
                        <Divider />
                      </List>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography fontWeight="bold">Mensajes</Typography>
                      <List>
                        {messages.map((message) => (
                          <React.Fragment key={message.id}>
                            <ListItem disableGutters>
                              <InboxIcon sx={{ marginRight: 2 }} />
                              <ListItemText
                                primary={message.subject}
                                secondary={`${message.sender} - ${message.time}`}
                              />
                            </ListItem>
                            <Divider />
                          </React.Fragment>
                        ))}
                      </List>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default DashboardPage;
