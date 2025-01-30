'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Container, Row, Col, Card, Button, Navbar, ListGroup, Alert, Badge } from 'react-bootstrap';
import { FaChartBar, FaUsers, FaBell, FaEnvelope, FaBars } from 'react-icons/fa';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState(["Caso Asignado a test1", "AgenteX inicio sesion por primera vez", "El caso con PNR 235428544 fue cambiado a Status: Cerrado"]);
  const [users, setUsers] = useState([
    { id: 1, name: 'Juan Pérez', status: 'Activo' },
    { id: 2, name: 'María López', status: 'Inactivo' },
    { id: 3, name: 'Carlos Ramírez', status: 'Activo' }
  ]);

  const salesChartData = {
    series: [{ name: 'Ventas', data: [30, 40, 45, 50, 49, 60, 70] }],
    options: {
      chart: { type: 'line' as const },
      xaxis: { categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] },
    }
  };

  const usersChartData = {
    series: [70, 30],
    options: {
      chart: { type: 'donut' as const },
      labels: ['Activos', 'Inactivos'],
      colors: ['#28a745', '#dc3545'],
    }
  };

  return (
    <div className="d-flex mt-4">
      <div className="flex-grow-1">
        <Container>
          <Row>
            <Col md={6}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Reporte de Casos</Card.Title>
                  <Chart options={salesChartData.options} series={salesChartData.series} type="line" height={300} />
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Distribución de Usuarios</Card.Title>
                  <Chart options={usersChartData.options} series={usersChartData.series} type="donut" height={300} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Notificaciones</Card.Title>
                  {notifications.map((notif, index) => (
                    <Alert key={index} variant="info">{notif}</Alert>
                  ))}
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <Card.Body>
                  <Card.Title>Usuarios Activos</Card.Title>
                  <ListGroup>
                    {users.map(user => (
                      <ListGroup.Item key={user.id} className="d-flex align-items-center">
                        {user.status === 'Activo' && <Badge bg="success" className="me-2" style={{ width: '12px', height: '12px', borderRadius: '50%' }}></Badge>}
                        {user.name} - {user.status}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;
