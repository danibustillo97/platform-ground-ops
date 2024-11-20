"use client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./FlightsTable.module.css";
import DataTable from "react-data-table-component";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OverlayComponent from "@/components/Overlay/Overlay";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  TextField,
  Grid,
  Typography,
  Paper,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

interface Flight {
  carrier_name: string;
  flight_number: string;
  itinerary: {
    scheduled_departure_date: string;
    scheduled_departure_time: string;
    station_iata: string;
    flight_status: string;
    terminal: string;
    gate: string;
  }[];
}

interface ContactInfo {
  serviceLeader: { name: string; phone: string };
  rampLeader: { name: string; phone: string };
  trc: { name: string; phone: string };
}

const FlightsPage = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [originStation, setOriginStation] = useState<string>("");
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    serviceLeader: { name: "", phone: "" },
    rampLeader: { name: "", phone: "" },
    trc: { name: "", phone: "" },
  });
  const [isContactFormVisible, setIsContactFormVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [counterSetup, setCounterSetup] = useState<File | null>(null);
  const apiURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiURL}/api/fligths_manifest/flights`, {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        setFlights(data.flight_list || []);
        if (data.flight_list.length > 0) {
          setOriginStation(data.flight_list[0].itinerary[0].station_iata);
        }
      } catch (error) {
        console.error("Error fetching flights:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [apiURL]);

  const handleFlightSelection = (flight: Flight) => {
    setSelectedFlight(flight === selectedFlight ? null : flight);
  };

  const handleContactChange = (
    role: keyof ContactInfo,
    field: "name" | "phone",
    value: string
  ) => {
    setContactInfo((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [field]: value,
      },
    }));
  };

  const toggleContactForm = () => {
    setIsContactFormVisible(!isContactFormVisible);
  };

  const columns = [
    {
      name: "Estación",
      selector: (row: Flight) => row.itinerary[0].station_iata,
      sortable: true,
    },
    {
      name: "Número de Vuelo",
      selector: (row: Flight) => row.flight_number,
      sortable: true,
    },
    {
      name: "Aerolínea",
      selector: (row: Flight) => row.carrier_name,
      sortable: true,
    },
    {
      name: "Fecha de Salida",
      selector: (row: Flight) => row.itinerary[0].scheduled_departure_date,
      sortable: true,
    },
    {
      name: "Hora de Salida",
      selector: (row: Flight) => row.itinerary[0].scheduled_departure_time,
      sortable: true,
    },
    {
      name: "Estado del Vuelo",
      selector: (row: Flight) => row.itinerary[0].flight_status,
      sortable: true,
    },
    {
      name: "Puerta",
      selector: (row: Flight) => row.itinerary[0].gate,
      sortable: true,
    },
  ];

  const conditionalRowStyles = [
    {
      when: (row: Flight) =>
        selectedFlight !== null &&
        row.flight_number === selectedFlight?.flight_number,
      style: {
        backgroundColor: "#510c76b9",
        color: "white",
        "&:hover": {
          cursor: "pointer",
        },
      },
    },
  ];

  return loading ? (
    <OverlayComponent />
  ) : (
    <div className={styles.container}>
      <Typography variant="h4" gutterBottom>
        Lista de Vuelos desde {originStation}
      </Typography>

      <Paper
        elevation={3}
        className={`${styles.tableWrapper} ${styles.scrollableTable}`}
      >
        <DataTable
          columns={columns}
          data={flights}
          pagination
          onRowClicked={handleFlightSelection}
          highlightOnHover
          pointerOnHover
          conditionalRowStyles={conditionalRowStyles}
        />
      </Paper>

      {selectedFlight && (
        <Accordion expanded={isContactFormVisible} onChange={toggleContactForm}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">
              Detalles del Vuelo: {selectedFlight.flight_number}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {["serviceLeader", "rampLeader", "trc"].map((role) => (
                <Grid item xs={12} sm={6} key={role}>
                  <Typography variant="subtitle1">
                    {role.replace(/([A-Z])/g, " $1")}
                  </Typography>
                  <TextField
                    label="Nombre"
                    variant="outlined"
                    fullWidth
                    value={contactInfo[role as keyof ContactInfo].name}
                    onChange={(e) =>
                      handleContactChange(
                        role as keyof ContactInfo,
                        "name",
                        e.target.value
                      )
                    }
                  />
                  <TextField
                    label="Teléfono"
                    variant="outlined"
                    fullWidth
                    value={contactInfo[role as keyof ContactInfo].phone}
                    onChange={(e) =>
                      handleContactChange(
                        role as keyof ContactInfo,
                        "phone",
                        e.target.value
                      )
                    }
                  />
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={2} justifyContent="flex-start">
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isContactFormVisible}
                      onChange={toggleContactForm}
                      name="contactFormToggle"
                    />
                  }
                  label="Mostrar campos de contacto"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}
    </div>
  );
};

export default FlightsPage;
