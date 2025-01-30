"use client"
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Button, Tabs, Tab } from "react-bootstrap";
import { useBaggageCasesController } from "@/view/baggage/useBaggageCasesController";
import Filters from "@/view/baggage/components/Filters";
import BaggageTable from "@/view/baggage/BaggageTable/BaggageTable";
import { BaggageCase } from "@/domain/types/BaggageCase";
import styles from "@/view/baggage/baggage.module.css";
import { PiMicrosoftExcelLogoBold } from "react-icons/pi";
import * as XLSX from 'xlsx';
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

    try {
      for (const baggageCase of updatedRows) {
        if (!baggageCase.id) {
          console.error("El caso de equipaje no tiene un ID definido:", baggageCase);
          continue;
        }

        const baggage_case_id = baggageCase.id;
        const url = `https://arajet-app-odsgrounds-backend-dev-fudkd8eqephzdubq.eastus-01.azurewebsites.net/api/baggage-case/${baggage_case_id}`;
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJEYW5pbG8uQnVzdGlsbG8uZXh0QGFyYWpldC5jb20iLCJleHAiOjE3MzQwOTgxNzh9.OAJhlGGjsW-K1QQMhOERQNujLxvvv7-rA_xtnOHXOxw";
        console.log(`Guardando caso de equipaje con ID: ${baggage_case_id}`);

        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(baggageCase),
        });

        if (!response.ok) {
          throw new Error(`Error al guardar el caso con ID: ${baggage_case_id}`);
        }

        const data = await response.json();
        console.log(`Respuesta de la API para el caso ${baggage_case_id}:`, data);
      }
    } catch (error) {
      console.error("Error enviando los datos a la API:", error);
    }
  };

  const handleCancel = async (id: string) => {
    console.log("relod")
  };

  const handleExportExcel = () => {
    console.log("Exporting to Excel...");

    const ws = XLSX.utils.json_to_sheet(filteredCases);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "BaggageCases");

    XLSX.writeFile(wb, "BaggageCases.xlsx");
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
                <Col xs="auto" style={{ display: "flex", alignItems: "center",  marginLeft: "10px"}}>
                  <h5 className="mb-1 " style={{ fontSize: "1.2rem" }}>Equipajes</h5>
                </Col>
                <Col xs="auto" className="d-flex justify-content-end">
                  <Button
                    variant="light"
                    onClick={handleExportExcel}
                    className={`${styles.ButtonExcel} s`}
                    style={{
                      backgroundColor: "#fff",
                      borderColor: "#510C76",
                      color: "#510C76",
                      fontSize: "0.9rem",

                    }}
                  >
                    <PiMicrosoftExcelLogoBold />
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
                    onNotificationChange={(newNotifications: number) => {
                      console.log("New notifications:", newNotifications);
                    }}
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
