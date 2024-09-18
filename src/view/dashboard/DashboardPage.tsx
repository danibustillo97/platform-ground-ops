"use client";
import React, { useEffect, useRef } from "react";
import styles from "./DashboardPage.module.css";
import {
  Chart,
  PieController,
  BarController,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartConfiguration,
} from "chart.js";
import { SvgIcon } from "@mui/material";
import { Luggage, CheckCircle, HourglassEmpty } from "@mui/icons-material";
// import ProtectedRoute from "@/components/ProtectedRoute";

Chart.register(
  PieController,
  BarController,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);

const DashboardPage: React.FC = () => {
  const chart1Ref = useRef<HTMLCanvasElement | null>(null);
  const chart2Ref = useRef<HTMLCanvasElement | null>(null);
  const chart1Instance = useRef<Chart<"pie"> | null>(null);
  const chart2Instance = useRef<Chart<"bar"> | null>(null);

  useEffect(() => {
    if (chart1Ref.current) {
      if (chart1Instance.current) {
        chart1Instance.current.destroy();
      }

      const chart1Config: ChartConfiguration<"pie", number[], string> = {
        type: "pie",
        data: {
          labels: ["Perdidos", "Recuperados", "En Proceso"],
          datasets: [
            {
              label: "Estado de Equipajes",
              data: [45, 75, 30],
              backgroundColor: ["#FF4E00", "#9BBE68", "#FFC400"],
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              position: "top",
            },
          },
        },
      };
      chart1Instance.current = new Chart(chart1Ref.current, chart1Config);
    }

    if (chart2Ref.current) {
      if (chart2Instance.current) {
        chart2Instance.current.destroy();
      }

      const chart2Config: ChartConfiguration<"bar", number[], string> = {
        type: "bar",
        data: {
          labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
          datasets: [
            {
              label: "Recuperación",
              data: [5, 10, 15, 20, 25, 30],
              backgroundColor: "#510C76",
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
      chart2Instance.current = new Chart(chart2Ref.current, chart2Config);
    }

    return () => {
      if (chart1Instance.current) {
        chart1Instance.current.destroy();
      }
      if (chart2Instance.current) {
        chart2Instance.current.destroy();
      }
    };
  }, []);

  return (
    // <ProtectedRoute>
    <div className={styles.dashboardContainer}>
      <div className={styles.innerContainer}>
        <h1 className={styles.header}>Dashboard</h1>

        <div className={`${styles.gridContainer} ${styles.gridContainerMd}`}>
          <div className={styles.card}>
            <SvgIcon component={Luggage} className={styles.cardIcon} />
            <div className={styles.cardText}>120</div>
            <div className={styles.cardSubtext}>Total de Equipajes</div>
          </div>
          <div className={`${styles.card} ${styles.cardRecovered}`}>
            <SvgIcon component={CheckCircle} className={styles.cardIcon} />
            <div className={styles.cardText}>75</div>
            <div className={styles.cardSubtext}>Equipajes Recuperados</div>
          </div>
          <div className={`${styles.card} ${styles.cardInProgress}`}>
            <SvgIcon component={HourglassEmpty} className={styles.cardIcon} />
            <div className={styles.cardText}>30</div>
            <div className={styles.cardSubtext}>Equipajes en Proceso</div>
          </div>
        </div>

        <div
          className={`${styles.gridContainer} ${styles.gridContainerCharts}`}
        >
          <div className={styles.chartContainer}>
            <h2 className={styles.chartTitle}>Estado de Equipajes</h2>
            <div className={styles.canvasWrapper}>
              <canvas ref={chart1Ref}></canvas>
            </div>
          </div>
          <div className={styles.chartContainer}>
            <h2 className={styles.chartTitle}>Recuperación Mensual</h2>
            <div className={styles.canvasWrapper}>
              <canvas ref={chart2Ref}></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
    // </ProtectedRoute>
  );
};

export default DashboardPage;
