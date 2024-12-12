import React from "react";
import { Form, Row, Col } from "react-bootstrap";

// Definir los filtros
const filters = {
  searchTerm: "",
  status: "",
  startDate: "",
  endDate: "",
} as const;

type FilterKeys = keyof typeof filters;

interface FilterProps {
  searchTerm: string;
  status: string;
  startDate: string;
  endDate: string;
  onChange: (field: FilterKeys, value: string) => void;
}

const Filters: React.FC<FilterProps> = ({
  searchTerm,
  status,
  startDate,
  endDate,
  onChange,
}) => (

  <div style={{ width: "100%",  marginBottom: "20px" }}>
    <Form>
      <Row className="g-3">
        {/* Campo de búsqueda */}
        <Col xs={12} sm={6} md={3} lg={2}>
          <Form.Group controlId="searchTerm">
            <Form.Label>Buscar</Form.Label>
            <Form.Control
              type="text"
              placeholder="Escribe para buscar..."
              value={searchTerm}
              onChange={(e) => onChange("searchTerm", e.target.value)} 
            />
          </Form.Group>
        </Col>

        {/* Selector de estado */}
        <Col xs={12} sm={6} md={3} lg={2}>
          <Form.Group controlId="status">
            <Form.Label>Estado</Form.Label>
            <Form.Select
              value={status}
              onChange={(e) => onChange("status", e.target.value)} // Aquí se pasa la clave "status"
            >
              <option value="">Selecciona un estado</option>
              <option value="Abierto">Abierto</option>
              <option value="Cerrado">Cerrado</option>
              <option value="En espera">En espera</option>
            </Form.Select>
          </Form.Group>
        </Col>

        {/* Filtro de fecha de inicio */}
        <Col xs={12} sm={6} md={3} lg={2}>
          <Form.Group controlId="startDate">
            <Form.Label>Fecha de Inicio</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => onChange("startDate", e.target.value)} 
            />
          </Form.Group>
        </Col>

        {/* Filtro de fecha de fin */}
        <Col xs={12} sm={6} md={3} lg={2}>
          <Form.Group controlId="endDate">
            <Form.Label>Fecha de Fin</Form.Label>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => onChange("endDate", e.target.value)} 
            />
          </Form.Group>
        </Col>
      </Row>
    </Form>
  </div>
);

export default Filters;
