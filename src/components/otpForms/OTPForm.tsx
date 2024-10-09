import React, { useState } from 'react';
import styles from './OTPForm.module.css';

interface Flight {
  id: number;
  carrier_name: string;
  flight_number: string;
  scheduled_departure_date: string;
}

interface OTPFormProps {
  flights: Flight[];
  onSubmit: (otp: string, selectedFlight: Flight | null) => void;
}

const OTPForm: React.FC<OTPFormProps> = ({ flights, onSubmit }) => {
  const [otp, setOtp] = useState<string>('');
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(otp, selectedFlight);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Formulario OTP</h2>
      <label htmlFor="otp">Ingrese el código OTP:</label>
      <input
        type="text"
        id="otp"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
        className={styles.input}
      />

      <label htmlFor="flights">Seleccione un vuelo:</label>
      <select
        id="flights"
        onChange={(e) => {
          const flightId = Number(e.target.value);
          const flight = flights.find((f) => f.id === flightId) || null;
          setSelectedFlight(flight);
        }}
        className={styles.select}
      >
        <option value="">Seleccione un vuelo</option>
        {flights.map((flight) => (
          <option key={flight.id} value={flight.id}>
            {flight.carrier_name} - {flight.flight_number} - {flight.scheduled_departure_date}
          </option>
        ))}
      </select>

      <button type="submit" className={styles.button}>
        Enviar OTP
      </button>
    </form>
  );
};

export default OTPForm;
