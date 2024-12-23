"use client";
import React, { useState, useEffect } from "react";
import {
  fetchAllUsers,
  deleteUserById,
  createNewUser,
  updateExistingUser,
} from "@/view/users/userController";
import { User, UserCreate } from "@/entities/User";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Modal,
  Spinner,
  Card,
  Dropdown,
  DropdownButton,
  DropdownItem,
  Badge,
} from "react-bootstrap";
import { FaEdit, FaEnvelope, FaComments, FaEllipsisV } from "react-icons/fa";

const UsersView: React.FC = () => {
  const [usersData, setUsersData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState<UserCreate>({
    name: "",
    email: "",
    phone: "",
    rol: "",
    estacion: [],
    password: "",
  });

  const roles = ["Admin", "User", "Manager"];

  const airportStations = [
    "SDQ", "CTG", "BOG", "MDE", "AUA", "CUR", "PUJ", "EZE", "YUL", "STI", "LIM", "YYZ", "KIN",
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersResponse = await fetchAllUsers();
      setUsersData(usersResponse);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUserById(id);
      fetchUsers();
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  const handleSaveUser = async () => {
    try {
      if (editingUser) {
        await updateExistingUser(editingUser.id, { ...editingUser, ...userForm });
      } else {
        await createNewUser({ id: Math.random(), isOnline: false, ...userForm });
      }
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      rol: user.rol,
      estacion: Array.isArray(user.estacion) ? user.estacion : [],
      password: "",
    });
    setShowModal(true);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setUserForm({
      name: "",
      email: "",
      phone: "",
      rol: "",
      estacion: [],
      password: "",
    });
    setShowModal(true);
  };

  const handleSelectStation = (station: string) => {
    const updatedStations = userForm.estacion.includes(station)
      ? userForm.estacion.filter(st => st !== station) // Remove if already selected
      : [...userForm.estacion, station]; // Add if not selected
    setUserForm({ ...userForm, estacion: updatedStations });
  };

  // Asegurarse de que 'estacion' es un arreglo antes de intentar usarlo
  const userStations = Array.isArray(userForm.estacion) ? userForm.estacion : [];

  const [filter, setFilter] = useState<{ name: string; rol: string; estacion: string }>({
    name: "",
    rol: "",
    estacion: "",
  });

  useEffect(() => {
    // Apply filter logic here if needed
    // For example, you can filter usersData based on the filter state
  }, [filter]);

  return (
    <Container fluid className="py-5">
      <h2 className="text-center mb-5 text-primary fw-bold">Gestión de Usuarios</h2>

      {/* Filtros */}
      <Row className="mb-4">
        <Col sm={12} md={4}>
          <Form.Control
            type="text"
            placeholder="Filtrar por nombre"
            value={filter.name}
            onChange={(e) => setFilter({ ...filter, name: e.target.value })}
          />
        </Col>
        <Col sm={12} md={4}>
          <DropdownButton
            id="dropdown-rol"
            title="Filtrar por Rol"
            variant="outline-secondary"
            className="w-100"
            onSelect={(rol) => setFilter({ ...filter, rol: rol || "" })}
          >
            <Dropdown.Item eventKey="">Todos</Dropdown.Item>
            {roles.map((rol) => (
              <Dropdown.Item key={rol} eventKey={rol}>
                {rol}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </Col>
        <Col sm={12} md={4}>
          <DropdownButton
            id="dropdown-stations"
            title="Filtrar por Estación"
            variant="outline-secondary"
            className="w-100"
            onSelect={(station) => setFilter({ ...filter, estacion: station || "" })}
          >
            <Dropdown.Item eventKey="">Todas</Dropdown.Item>
            {airportStations.map((station) => (
              <Dropdown.Item key={station} eventKey={station}>
                {station}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </Col>
      </Row>

      {/* Botón "Añadir Usuario" */}
      <Button className="mb-4 rounded-pill px-4 py-2 fw-bold" onClick={handleAddUser} style={{ backgroundColor: '#510C76', color: '#fff' }}>
        Añadir Usuario
      </Button>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Row>
          {usersData.map((user) => (
            <Col key={user.id} sm={12} md={6} lg={3} xl={3} className="mb-4">
              <Card className="shadow-sm border-0">
                <div className="position-relative">
                  <div className="container justify-content-center d-flex align-items-center position-relative">
                  <div className={`position-absolute top-0 start-0 mt-1 ms-1 ${user.isOnline ? 'bg-success' : 'bg-danger'} rounded-circle`} style={{ width: '12px', height: '12px' }} />
                  <span className="position-absolute top-0 start-0 mt-1 ms-4 " style={{color:"#510C76", fontSize:"0.6rem"}}>{user.isOnline ? 'Online' : 'Disconnected'}</span>
                  </div>
                  <Card.Img
                    variant="top"
                    src={`https://i.pravatar.cc/150?img=12`}
                    className="img-fluid rounded-circle mx-auto d-block"
                    style={{ width: '80px', height: '80px' }}
                  />
                  <Dropdown align="end" className="position-absolute top-0 end-0 m-2">
                    <Dropdown.Toggle variant="link" id="dropdown-custom-components">
                      <FaEllipsisV />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleDelete(user.id)}>Eliminar</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <Card.Body>
                  <Card.Title className="text-center  fw-bold" style={{ color: '#ACBFDC' }}>{user.name}</Card.Title>
                  <Card.Text className="text-center text-muted mb-3" style={{ color: '#dee2e6' }}>{user.email}</Card.Text>
                  <div className="d-flex justify-content-center mb-3">
                    {/* Mostrar las estaciones seleccionadas */}
                    <div className="d-flex flex-wrap">
                      {userStations.map((station) => (
                        <Badge key={station} bg="primary" className="me-2 mb-2">
                          {station}
                        </Badge>
                      ))}
                    </div>
                    {/* Dropdown para las estaciones */}
                    <DropdownButton
                      id="dropdown-stations"
                      title="Estaciones"
                      variant="outline-secondary"
                      className="w-auto"
                    >
                      {airportStations.map((station) => (
                        <Dropdown.Item
                          key={station}
                          active={userForm.estacion.includes(station)}
                          onClick={() => handleSelectStation(station)}
                        >
                          {station}
                        </Dropdown.Item>
                      ))}
                    </DropdownButton>
                  </div>
                  <div className="d-flex justify-content-between">
                    <Button
                      variant="outline-primary"
                      onClick={() => handleEditUser(user)}
                      title="Editar"
                      className="flex-grow-1 mx-1"
                      style={{ backgroundColor: '#510C76', color: '#fff' }}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outline-info"
                      onClick={() => console.log("Enviar mensaje a", user.name)}
                      title="Mensaje"
                      className="flex-grow-1 mx-1"
                    >
                      <FaComments />
                    </Button>
                    <Button
                      variant="outline-success"
                      onClick={() => console.log("Enviar email a", user.email)}
                      title="Email"
                      className="flex-grow-1 mx-1"
                    >
                      <FaEnvelope />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}


      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingUser ? "Editar Usuario" : "Añadir Usuario"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName" className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={userForm.name}
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPhone" className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                value={userForm.phone}
                onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleSaveUser}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UsersView;
