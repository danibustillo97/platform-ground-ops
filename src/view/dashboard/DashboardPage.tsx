"use client"; // Agrega esto al inicio de tu archivo
import React, { useEffect, useRef, useState } from "react";
import { BarController, Chart, ChartConfiguration } from "chart.js";
import { SvgIcon } from "@mui/material";
import { Luggage, CheckCircle, HourglassEmpty } from "@mui/icons-material";
import styles from "@/view/dashboard/DashboardPage.module.css";
import OverlayComponent from "@/components/Overlay/Overlay"


import { FaRegCheckCircle } from "react-icons/fa";
import { MdLuggage } from "react-icons/md";
import { RiProgress1Line } from "react-icons/ri";

// Define la interfaz para los datos de equipaje
interface Baggage {
  status: string;
}

// Importa los módulos de Chart.js necesarios
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  LineController,
  PieController,
  PointElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
} from "chart.js";


// Registra las escalas y elementos que necesites
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  LineController,
  BarController,
  PointElement,
  PieController,
  Title,
  Tooltip,
  Legend,
  BarElement, 
  ArcElement 

);

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [baggageData, setBaggageData] = useState<Baggage[]>([]);
  const lineChartRef = useRef<HTMLCanvasElement | null>(null);
  const barChartRef = useRef<HTMLCanvasElement | null>(null);
  const pieChartRef = useRef<HTMLCanvasElement | null>(null);
  const lineChartInstance = useRef<Chart | null>(null);
  const barChartInstance = useRef<Chart | null>(null);
  const pieChartInstance = useRef<Chart<"pie", number[], string> | null>(null);

  useEffect(() => {
    // Simulación de la carga de datos
    setTimeout(() => {
      setBaggageData([
        { status: "Abierto" },
        { status: "Recuperado" },
        { status: "En Proceso" },
        { status: "Perdido" },
        { status: "Recuperado" },
        { status: "En Proceso" },
        // Otros datos aquí
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Procesamiento de datos para el gráfico
  const statusCounts = {
    Abierto: baggageData.filter(baggage => baggage.status === "Abierto").length,
    Recuperado: baggageData.filter(baggage => baggage.status === "Recuperado").length,
    "En Proceso": baggageData.filter(baggage => baggage.status === "En Proceso").length,
  };

  const labels = Object.keys(statusCounts);
  const statusData = Object.values(statusCounts).map(Number);

  // Inicialización del gráfico de líneas
  useEffect(() => {
    if (lineChartRef.current) {
      if (lineChartInstance.current) {
        lineChartInstance.current.destroy();
      }

      const lineChartConfig: ChartConfiguration<"line", number[], string> = {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Conteo por Estado",
              data: statusData,
              backgroundColor: "rgba(81, 12, 118, 0.3)",
              borderColor: "#510C76",
              borderWidth: 2,
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
            },
            y: {
              grid: {
                color: "rgba(0, 0, 0, 0.1)",
              },
            },
          },
        },
      };

      lineChartInstance.current = new Chart(lineChartRef.current, lineChartConfig);
    }
  }, [baggageData, labels, statusData]);

  // Inicialización del gráfico de barras
  useEffect(() => {
    if (barChartRef.current) {
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
      }

      const barChartConfig: ChartConfiguration<"bar", number[], string> = {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Equipajes por Estado",
              data: statusData,
              backgroundColor: ["#510C76", "#5B8D80", "#C15D89"], // Colores diferentes para cada barra
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(0, 0, 0, 0.1)",
              },
            },
          },
        },
      };

      barChartInstance.current = new Chart(barChartRef.current, barChartConfig);
    }
  }, [baggageData, labels, statusData]);

  // Inicialización del gráfico circular


  return (
    <div className={styles.innerContainer}>
      {loading ? (
       <OverlayComponent /> 
      ) : (
        <div className={` card d-flex  ${styles.gridContainer}`}>


          <div className={`${styles.cardContainer}`}>
            <div className={` card ${styles.card} ${styles.cardLost}`}>
              <MdLuggage className={styles.cardIcon} />
              <div className={styles.cardText}>{statusCounts.Abierto}</div>
              <div className={styles.cardSubtext}>Equipajes Abierto</div>
            </div>
            <div className={`col-md-3 ${styles.card} ${styles.cardRecovered}`}>
              <FaRegCheckCircle className={styles.cardIcon}/>
             
              <div className={styles.cardText}>{statusCounts.Recuperado}</div>
              <div className={styles.cardSubtext}>Equipajes Recuperados</div>
            </div>
            <div className={`col-md-3 ${styles.card} ${styles.cardInProgress}`}>
                 <RiProgress1Line className={styles.cardIcon}/>
              <div className={styles.cardText}>{statusCounts["En Proceso"]}</div>
              <div className={styles.cardSubtext}>Equipajes en Proceso</div>
            </div>
          </div>


          <div className={styles.chartBoxContainer}>
            <div className={styles.chartContainer}>
              <h2>Gráfico de Líneas</h2>
              <canvas ref={lineChartRef} />
            </div>

            <div className={styles.chartContainer}>
              <h2>Gráfico de Barras</h2>
              <canvas ref={barChartRef} />
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
