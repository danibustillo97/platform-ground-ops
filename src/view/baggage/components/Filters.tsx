import React from "react";
import { Form, Row, Col } from "react-bootstrap";

// Definir los filtros y el tipo de claves de filtro dentro del mismo archivo
const filters = {
  searchTerm: "",
  status: "",
  startDate: "",
  endDate: "",
} as const;

type FilterKeys = keyof typeof filters; // Extraemos las claves de filters

// Definir las propiedades del componente
interface FilterProps {
  searchTerm: string;
  status: string;
  startDate: string;
  endDate: string;
  // El tipo de onChange debe usar las claves de FilterKeys
  onChange: (field: FilterKeys, value: string) => void;
}

const Filters: React.FC<FilterProps> = ({
  searchTerm,
  status,
  startDate,
  endDate,
  onChange,
}) => (
  <Form>
    <Row className="g-3">
      {/* Campo de búsqueda */}
      <Col xs={12} sm={6} md={3}>
        <Form.Group controlId="searchTerm">
          <Form.Label>Buscar</Form.Label>
          <Form.Control
            type="text"
            placeholder="Escribe para buscar..."
            value={searchTerm}
            onChange={(e) => onChange("searchTerm", e.target.value)} // Aquí se pasa la clave "searchTerm"
          />
        </Form.Group>
      </Col>

      {/* Selector de estado */}
      <Col xs={12} sm={6} md={3}>
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
      <Col xs={12} sm={6} md={3}>
        <Form.Group controlId="startDate">
          <Form.Label>Fecha de Inicio</Form.Label>
          <Form.Control
            type="date"
            value={startDate}
            onChange={(e) => onChange("startDate", e.target.value)} // Aquí se pasa la clave "startDate"
          />
        </Form.Group>
      </Col>

      {/* Filtro de fecha de fin */}
      <Col xs={12} sm={6} md={3}>
        <Form.Group controlId="endDate">
          <Form.Label>Fecha de Fin</Form.Label>
          <Form.Control
            type="date"
            value={endDate}
            onChange={(e) => onChange("endDate", e.target.value)} // Aquí se pasa la clave "endDate"
          />
        </Form.Group>
      </Col>
    </Row>
  </Form>
);

export default Filters;
