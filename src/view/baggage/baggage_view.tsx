"use client"
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Button, Tabs, Tab } from "react-bootstrap";
import { useBaggageCasesController } from "@/view/baggage/useBaggageCasesController";
import Filters from "@/view/baggage/components/Filters";
import BaggageTable from "@/view/baggage/components/BaggageTable";
import { BaggageCase } from "@/domain/types/BaggageCase";
import styles from "@/view/baggage/baggage.module.css";

// Importa la vista de Registro de Pérdida de Equipaje
import FormReclamoView from "@/view/baggage/form_baggage/form_baggage_view";

const BaggageView: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { loading, filters, filteredCases, setFilter, updateCase } = useBaggageCasesController();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleEdit = (id: string) => {
    console.log("Edit", id);
  };

  const handleSave = async (updatedRows: BaggageCase[]) => {
    console.log("Save", updatedRows);
  };

  const handleCancel = async (id: string) => {
    console.log("relod")
  };

  const handleExportExcel = () => {
    console.log("Exporting to Excel...");
  };

  const handleAddCase = () => {
    console.log("Adding new baggage case...");
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
          <Card className="shadow-lg border-0">
            <Card.Header className={`${styles.CardHeader}`} style={{ backgroundColor: "#510C76", color: "#fff" }}>
              <Row className="d-flex justify-content-between w-100">
                <Col xs="auto">
                  <h5 className="mb-0" style={{ fontSize: "1.2rem" }}>Filtros</h5>
                </Col>
                <Col xs="auto" className="d-flex justify-content-end">
                  <Button
                    variant="light"
                    onClick={handleExportExcel}
                    className={`${styles.ButtonExcel} me-2`}
                    style={{
                      backgroundColor: "#fff",
                      borderColor: "#510C76",
                      color: "#510C76",
                    }}
                  >
                    Exportar Excel
                  </Button>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body style={{ backgroundColor: "#f7f7f7" }}>
              <Filters
                searchTerm={filters.searchTerm}
                status={filters.status}
                startDate={filters.startDate}
                endDate={filters.endDate}
                onChange={setFilter}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="shadow-lg border-0">
            <Card.Header className={`${styles.CardHeader}`} style={{ backgroundColor: "#510C76", color: "#fff" }}>
              <h5 className="mb-0" style={{ fontSize: "1.2rem" }}>Equipajes</h5>
            </Card.Header>
            <Card.Body style={{ backgroundColor: "#f7f7f7" }}>
              <Tabs defaultActiveKey="gestion" id="baggage-tabs" className="mb-3" style={{ borderColor: "#510C76" }}>
                <Tab
                  eventKey="gestion"
                  title="Gestión de Equipaje"
                  className="border-0"
                  style={{ color: "#510C76", fontWeight: "600" }}
                >
                  <BaggageTable
                    rows={filteredCases}
                    onSaveChanges={handleSave}
                    onEdit={handleEdit}
                    onCancel={handleCancel}
                    searchTerm={""}
                    status={""}
                    startDate={""}
                    endDate={""}
                  />
                </Tab>
                <Tab
                  eventKey="agregar"
                  title="Agregar Equipaje"
                  className="border-0"
                  style={{ color: "#510C76", fontWeight: "600" }}
                >
                  <FormReclamoView />
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BaggageView;
