import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';

interface NotificationComponentProps {
  notifications: { [key: string]: boolean };
  setNotifications: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
}

const NotificationComponent: React.FC<NotificationComponentProps> = ({ notifications, setNotifications }) => {
  const handleAccept = (id: string) => {
    setNotifications((prevNotifications) => ({
      ...prevNotifications,
      [id]: true,
    }));
  };

  const handleReject = (id: string) => {
    setNotifications((prevNotifications) => ({
      ...prevNotifications,
      [id]: false,
    }));
  };

  return (
    <div>
      {Object.keys(notifications).map((id) => (
        <Modal key={id} show={notifications[id] === undefined} onHide={() => handleReject(id)}>
          <Modal.Header closeButton>
            <Modal.Title>Nueva Notificación</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>¿Aceptas este caso?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={() => handleAccept(id)}>
              <FaCheck /> Aceptar
            </Button>
            <Button variant="danger" onClick={() => handleReject(id)}>
              <FaTimes /> Rechazar
            </Button>
          </Modal.Footer>
        </Modal>
      ))}
    </div>
  );
};

export default NotificationComponent;
