"use client";
import React, { useEffect, useState } from "react";
import styles from "@/view/dashboard/DashboardPage.module.css";
import OverlayComponent from "@/components/Overlay/Overlay";
import Sidebar from "@/components/sidebars/Sidebar";
import { Chart } from "primereact/chart";

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
      { id: 1, subject: "Asunto 1", sender: "Usuario A", time: "10:00 AM", content: "Contenido del mensaje 1" },
      { id: 2, subject: "Asunto 2", sender: "Usuario B", time: "10:30 AM", content: "Contenido del mensaje 2" },
      { id: 3, subject: "Asunto 3", sender: "Usuario C", time: "11:00 AM", content: "Contenido del mensaje 3" },
    ]);
  }, []);

  const statusCounts = {
    Abierto: baggageData.filter((baggage) => baggage.status === "Abierto").length,
    Recuperado: baggageData.filter((baggage) => baggage.status === "Recuperado").length,
    "En Proceso": baggageData.filter((baggage) => baggage.status === "En Proceso").length,
    Perdido: baggageData.filter((baggage) => baggage.status === "Perdido").length,
  };

  const labels = Object.keys(statusCounts);
  const statusData = Object.values(statusCounts);

  const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"];

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Conteo por Estado",
        data: statusData,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  const monthlyRecoveryData = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto"],
    datasets: [
      {
        label: "Recuperaciones por Mes",
        data: [10, 15, 20, 12, 18, 22, 16, 19],
        backgroundColor: colors,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Permite que el gráfico use el espacio disponible
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 10, // Ajusta el tamaño de la fuente de la leyenda
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: {
            size: 10, // Tamaño de la fuente de los ticks del eje X
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0, 0, 0, 0.1)" },
        ticks: {
          font: {
            size: 10, // Tamaño de la fuente de los ticks del eje Y
          },
        },
      },
    },
  };
  

  return (
    <div className={styles.innerContainer}>
      {loading ? (
        <OverlayComponent />
      ) : (
        <div className="d-flex">
          <Sidebar isOpen={false} toggleSidebar={() => { }} />
          <div className={`flex-grow-1 ${styles.dashboardContent}`}>
            <div className="container-fluid py-4">
              {/* Widgets */}
              <div className="row mb-4">
                <div className="col-md-3">
                  <div className="card shadow-sm text-center p-3">
                    <h5>Abierto</h5>
                    <h3>{statusCounts.Abierto}</h3>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card shadow-sm text-center p-3">
                    <h5>Recuperado</h5>
                    <h3>{statusCounts.Recuperado}</h3>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card shadow-sm text-center p-3">
                    <h5>En Proceso</h5>
                    <h3>{statusCounts["En Proceso"]}</h3>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card shadow-sm text-center p-3">
                    <h5>Perdido</h5>
                    <h3>{statusCounts.Perdido}</h3>
                  </div>
                </div>
              </div>

              {/* Gráficos */}
              <div className="row mt-4">
                <div className="col-md-4">
                  <div className={`${styles.chartContainer} card`}>
                    <div className={styles.cardBody}>
                      <h5 className={styles.cardTitle}>Gráfico de Líneas</h5>
                      <div className={styles.chartWrapper}>
                        <Chart type="line" data={chartData} options={chartOptions} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className={`${styles.chartContainer} card`}>
                    <div className={styles.cardBody}>
                      <h5 className={styles.cardTitle}>Gráfico de Barras</h5>
                      <div className={styles.chartWrapper}>
                        <Chart type="bar" data={chartData} options={chartOptions} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className={`${styles.chartContainer} card`}>
                    <div className={styles.cardBody}>
                      <h5 className={styles.cardTitle}>Gráfico de Área Polar</h5>
                      <div className={styles.chartWrapper}>
                        <Chart type="polarArea" data={chartData} options={chartOptions} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-md-4">
                  <div className={`${styles.chartContainer} card`}>
                    <div className={styles.cardBody}>
                      <h5 className={styles.cardTitle}>Gráfico de Radar</h5>
                      <div className={styles.chartWrapper}>
                        <Chart type="radar" data={chartData} options={chartOptions} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className={`${styles.chartContainer} card`}>
                    <div className={styles.cardBody}>
                      <h5 className={styles.cardTitle}>Gráfico de Pie</h5>
                      <div className={styles.chartWrapper}>
                        <Chart type="pie" data={chartData} options={chartOptions} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className={`${styles.chartContainer} card`}>
                    <div className={styles.cardBody}>
                      <h5 className={styles.cardTitle}>Gráfico de Dona</h5>
                      <div className={styles.chartWrapper}>
                        <Chart type="doughnut" data={chartData} options={chartOptions} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>





              {/* Bandeja de Entrada */}
              <div className={`card shadow-sm bandejaEntrada`}>
                <div className="card-body">
                  <h5 className="card-title">Bandeja de Entrada</h5>
                  <ul className="list-group">
                    {messages.map((message) => (
                      <li key={message.id} className="list-group-item">
                        <div className="d-flex justify-content-between">
                          <div>
                            <strong>{message.subject}</strong><br />
                            <span>{message.sender}</span><br />
                            <small>{message.time}</small>
                          </div>
                          <button className="btn btn-primary btn-sm">Leer</button>
                        </div>
                        <p className="mt-2">{message.content}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
