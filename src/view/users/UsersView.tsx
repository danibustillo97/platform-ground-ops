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
  Badge,
  DropdownButton,
  ListGroup,
} from "react-bootstrap";
import { FaEdit, FaEnvelope, FaComments, FaEllipsisV } from "react-icons/fa";

const UsersView: React.FC = () => {
  const [usersData, setUsersData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    phone: "",
    rol: "",
    estaciones: [] as string[],
  });

  const roles = ["Admin", "User", "Agente"];
  const airportStations = [
    "SDQ", "CTG", "BOG", "MDE", "AUA", "CUR", "PUJ", "EZE", "YUL", "STI", "LIM", "YYZ", "KIN",
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
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
    const estacionArray = userForm.estaciones;
    try {
      if (editingUser) {
        await updateExistingUser(editingUser.id, { ...userForm, estacion: estacionArray });
      } else {
        await createNewUser({ id: Math.random(), isOnline: false, ...userForm, estacion: estacionArray });
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
      estaciones: Array.isArray(user.estacion)
        ? user.estacion.map(String)
        : (typeof user.estacion === 'string' ? (user.estacion as string).split(',').filter(Boolean) : [])


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
      estaciones: []
    });
    setShowModal(true);
  };

  const handleSelectStation = (eventKey: string | null) => {
    if (eventKey) {
      setUserForm({ ...userForm, estaciones: [...userForm.estaciones, eventKey] });
    }
  };

  const handleRemoveStation = (station: string) => {
    const updatedStations = userForm.estaciones.filter(st => st !== station);
    setUserForm({ ...userForm, estaciones: updatedStations });
  };

  const [filter, setFilter] = useState<{ name: string; rol: string; estacion: string }>({
    name: "",
    rol: "",
    estacion: "",
  });

  useEffect(() => {
    // Apply filter logic here if needed
  }, [filter]);

  return (
    <Container fluid className="py-5" style={{ backgroundColor: '#F5F5F5', minHeight: '100vh', overflowX: 'hidden' }}>
      <h2 className="text-center mb-5 fw-bold" style={{ color: '#510C76' }}>Gestión de Usuarios</h2>

      {/* Filtros */}
      <Row className="mb-4 bg-light p-3 rounded">
        <Col sm={12} md={4}>
          <Form.Control
            type="text"
            placeholder="Filtrar por nombre"
            value={filter.name}
            onChange={(e) => setFilter({ ...filter, name: e.target.value })}
            className="border-0 bg-light"
          />
        </Col>
        <Col sm={12} md={4}>
          <DropdownButton
            id="dropdown-rol"
            title="Filtrar por Rol"
            variant="outline-secondary"
            className="w-100 border-0 bg-light"
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
            className="w-100 border-0 bg-light"
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

      <Button className="mb-4 rounded-pill px-4 py-2 fw-bold" onClick={handleAddUser} style={{ backgroundColor: '#510C76', color: '#fff' }}>
        Añadir Usuario
      </Button>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Row>
          {usersData.map((user) => (
            <Col key={user.id} sm={12} md={6} lg={4} xl={3} className="mb-4">
              <Card className="shadow-sm border-0 rounded-4">
                <div className="d-flex justify-content-center mt-4">
                  <Card.Img
                    variant="top"
                    src={`https://i.pravatar.cc/150?img=12`}
                    className="img-fluid rounded-circle"
                    style={{ width: '90px', height: '90px', objectFit: 'cover' }}
                  />
                </div>
                <Card.Body className="pt-4">
                  <Card.Title className="text-center fw-bold" style={{ color: '#510C76', fontSize: '1.25rem' }}>
                    {user.name}
                  </Card.Title>
                  <Card.Text className="text-center text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                    {user.email}
                  </Card.Text>
                  <Card.Text className="text-center text-muted mb-4" style={{ fontSize: '0.9rem' }}>
                    <strong>Rol:</strong> {user.rol}
                  </Card.Text>

                  <div className="d-flex flex-wrap justify-content-center mb-3">
                    {user.estacion && user.estacion.length > 0 ? (
                      (typeof user.estacion === 'string' ? (user.estacion as string).split(',') : user.estacion)
                        .map((station: string) => (
                          <span
                            key={station}
                            className="badge  text-white m-1 p-1"
                            style={{
                              borderRadius: '20px',
                              fontSize: '0.6rem',
                              minWidth: '100px',
                              textAlign: 'center',
                              cursor: 'pointer',
                              backgroundColor: '#510C76',
                            }}
                          >
                            {station}
                          </span>
                        ))
                    ) : (
                      <p className="text-center text-muted" style={{ fontSize: '0.875rem' }}>No hay estaciones disponibles</p>
                    )}
                  </div>

                  <div className="d-flex justify-content-between mt-3">
                    <Button
                      variant="outline-primary"
                      onClick={() => handleEditUser(user)}
                      title="Editar"
                      className="flex-grow-1 "
                      style={{
                        backgroundColor: '#510C76',
                        color: '#fff',
                        borderRadius: '10px',
                        padding: '5px',
                      }}
                    >
                      <FaEdit style={{ fontSize: '10px' }} />
                    </Button>
                    <Button
                      variant="outline-secondary"
                      className="flex-grow-1 mx-1"
                      onClick={() => handleEditUser(user)}
                      style={{
                        borderRadius: '10px',
                        padding: '5px',
                      }}
                    >
                      <FaEnvelope style={{ fontSize: '10px' }} />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}


      {/* Modal User Form */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingUser ? "Editar Usuario" : "Nuevo Usuario"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Group controlId="formUserName" className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese nombre"
                value={userForm.name}
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="formUserEmail" className="mb-3">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingrese correo"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="formUserPhone" className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Ingrese teléfono"
                value={userForm.phone}
                onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="formUserRole" className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Control
                as="select"
                value={userForm.rol}
                onChange={(e) => setUserForm({ ...userForm, rol: e.target.value })}
              >
                <option value="">Seleccione un rol</option>
                {roles.map((rol) => (
                  <option key={rol} value={rol}>
                    {rol}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            {/* Estaciones seleccionadas */}
            <Form.Group controlId="formUserStations" className="mb-3">
              <Form.Label>Estaciones</Form.Label>
              <DropdownButton
                id="dropdown-stations"
                title="Agregar Estación"
                variant="outline-primary"
                className="w-100"
                onSelect={(eventKey: string | null) => {
                  if (eventKey && !userForm.estaciones.includes(eventKey)) {
                    setUserForm({
                      ...userForm,
                      estaciones: [...userForm.estaciones, eventKey],
                    });
                  }
                }}
              >
                {airportStations.map((station) => (
                  <Dropdown.Item key={station} eventKey={station}>
                    {station}
                  </Dropdown.Item>
                ))}
              </DropdownButton>

              {/* Lista de estacio nes con checkboxes */}
              <div className="mt-3 d-flex flex-wrap justify-content-start align-items-center gap-2 ">
                {userForm.estaciones.map((station) => (
                  <Form.Check
                    key={station}
                    type="checkbox"
                    label={station}
                    checked={userForm.estaciones.includes(station)}
                    onChange={() => {
                      const newStations = userForm.estaciones.includes(station)
                        ? userForm.estaciones.filter((s) => s !== station)
                        : [...userForm.estaciones, station];
                      setUserForm({ ...userForm, estaciones: newStations });
                    }}
                  />
                ))}
              </div>
            </Form.Group>

            <div className="text-center mt-3">
              <Button variant="" className="mt-3" onClick={handleSaveUser} style={{ backgroundColor: '#510C76', color: '#fff', borderRadius: '10px', padding: '5px', width: '100%' }}>
                Guardar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default UsersView;
