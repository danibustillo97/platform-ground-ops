"use client"
import React from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { useBaggageCasesController } from "@/view/baggage/useBaggageCasesController";
import Filters from "@/view/baggage/components/Filters";
import BaggageTable from "@/view/baggage/components/BaggageTable";
import { BaggageCase } from "@/domain/types/BaggageCase";
import styles from "@/view/baggage/baggage.module.css"

const BaggageView: React.FC = () => {
  const { loading, filters, filteredCases, setFilter, updateCase } =
    useBaggageCasesController();

  const handleEdit = (id: string) => {
    console.log("Edit", id);
  };

  const handleSave = (updatedRows: BaggageCase[]) => {
    console.log("Save", updatedRows);
  };

  const handleCancel = (id: string) => {
    console.log("Cancel", id);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status" style={{ color: "#510C76" }}>
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Header className={`${styles.CardHeader}`}>
              <h5 className="mb-0">Filtros</h5>
            </Card.Header>
            <Card.Body>
              <Filters
                searchTerm={filters.searchTerm}
                status={filters.status}
                startDate={filters.startDate}
                endDate={filters.endDate}
                onChange={setFilter}// Pasamos la función correctamente tipada
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Header className={`${styles.CardHeader}`}>
              <h5 className="mb-0">Gestión de Equipajes</h5>
            </Card.Header>
            <Card.Body>
              <BaggageTable rows={filteredCases} onSaveChanges={handleSave} onEdit={handleEdit} onCancel={handleCancel} searchTerm={""} status={""} startDate={""} endDate={""} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BaggageView;
