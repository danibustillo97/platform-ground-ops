import { BaggageCase, Status } from "@/domain/types/BaggageCase";
import { useState, useEffect } from "react";

const useModalBaggageController = (details: BaggageCase , onSave: (updatedDetails: BaggageCase) => void) => {
  const [phone, setPhone] = useState<string>(details.contact.phone);
  const [email, setEmail] = useState<string>(details.contact.email);
  const [status, setStatus] = useState<string>(details.status);

  useEffect(() => {
    setPhone(details.contact.phone);
    setEmail(details.contact.email);
    setStatus(details.status);
  }, [details]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Telefono actualizado:", e.target.value);  // Verifica el valor
    setPhone(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Email actualizado:", e.target.value);  // Verifica el valor
    setEmail(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("Status actualizado:", e.target.value);
    setStatus(e.target.value as Status);
  };

  const handleSubmit = (event: React.FormEvent) => {
    console.log("Phone:", phone);
    console.log("email:", email);
    console.log("Status:", status);

    const updatedDetails = {
      ...details,
      contact: {
        phone: phone,
        email: email
      },
      status: status,
      date_create: details.date_create,
    };
    console.log("valores actualizados: ",updatedDetails);

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
}

export default useModalBaggageController;