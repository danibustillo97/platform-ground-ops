import { BaggageCase, Status } from "@/domain/types/BaggageCase";
import { useState, useEffect } from "react";

const useModalBaggageController = (
  details: BaggageCase,
  onSave: (updatedDetails: BaggageCase) => void
) => {
  const [phone, setPhone] = useState<string>(details.contact.phone);
  const [email, setEmail] = useState<string>(details.contact.email);
  const [status, setStatus] = useState<Status>(details.status as Status); // Asegúrate de que sea del tipo correcto

  useEffect(() => {
    setPhone(details.contact.phone);
    setEmail(details.contact.email);
    setStatus(details.status as Status); // Convertir a Status
  }, [details]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Telefono actualizado:", e.target.value);
    setPhone(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Email actualizado:", e.target.value);
    setEmail(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("Status actualizado:", e.target.value);
    // Convertir el valor a Status
    const newStatus = e.target.value as Status;
    setStatus(newStatus);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    console.log("Phone:", phone);
    console.log("Email:", email);
    console.log("Status:", status);

    const updatedDetails = {
      ...details,
      contact: {
        phone: phone,
        email: email,
      },
      status: status, // status es del tipo Status
      date_create: details.date_create,
    };

    console.log("valores actualizados: ", updatedDetails);

    onSave(updatedDetails);
  };

  return {
    phone,
    email,
    status,
    handlePhoneChange,
    handleEmailChange,
    handleStatusChange,
    handleSubmit,
  };
};

export default useModalBaggageController;
