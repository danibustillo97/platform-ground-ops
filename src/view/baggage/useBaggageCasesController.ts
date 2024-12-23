import { useState, useEffect, useMemo, useCallback } from "react";
import { getSession } from "next-auth/react";
import { getBaggageCasesApi, putBaggageCasesAPI, deleteBaggageCasesAPI } from "@/data/api/baggageAPI";
import { BaggageCase } from "@/domain/types/BaggageCase";
import { initializeBlobServiceClient, uploadImageToAzure } from "@/services/azureStorage";

const getPermanentToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("sp=racwdl&st=2024-12-20T13:18:50Z&se=2036-02-01T21:18:50Z&spr=https&sv=2022-11-02&sr=c&sig=aOnQPAtbxbpfPiiVf%2FhXebtXK7ckActGjdhoi%2ByGayA%3D");
  }
  return null;
};

export const useBaggageCasesController = () => {
  const [baggageCases, setBaggageCases] = useState<BaggageCase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState({
    searchTerm: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const session = await getSession();
        const sessionToken = session?.user.access_token as string; // Solo usamos el token de la sesión
    
        if (!sessionToken) {
          throw new Error("Token de sesión no disponible.");
        }
    

        const sasToken = getPermanentToken(); 
    
        if (sasToken) {
          initializeBlobServiceClient(sasToken);
        }

        const data = await getBaggageCasesApi(sessionToken);
        setBaggageCases(data);
      } catch (error) {
        console.error("Error al cargar los casos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const uploadImage = useCallback(
    async (file: File) => {
      try {
        const session = await getSession();
        const sessionToken = session?.user.access_token as string; 
        const permanentToken = getPermanentToken(); 
      
        // if (!sessionToken || !permanentToken) {
        //   throw new Error("Token de sesión o token permanente no disponible.");
        // }
        if (permanentToken) {
          initializeBlobServiceClient(permanentToken);
        }
        const url = await uploadImageToAzure(file, "odsgrounops", file.name); 
       
        // await putBaggageCasesAPI("baggageCaseId", { /* Actualiza el objeto BaggageCase con la URL */ }, sessionToken);
        console.log("Imagen subida exitosamente:", url);
        return url;
      } catch (error) {
        console.error("Error al subir la imagen:", error);
      }
    },
    []
  );

  const filteredCases = useMemo(() => {
    const { searchTerm, status, startDate, endDate } = filters;
    return baggageCases.filter((caseItem) => {
      const date = caseItem.date_create
        ? new Date(caseItem.date_create).toISOString().split("T")[0]
        : null;

      const matchesDateRange =
        (!startDate || (date && date >= startDate)) &&
        (!endDate || (date && date <= endDate));

      const matchesSearchTerm = searchTerm
        ? ["PNR", "baggage_code", "passenger_name"].some((field) => {
          const fieldValue = caseItem[field as keyof BaggageCase];
          return typeof fieldValue === "string" &&
            fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
        })
        : true;

      const matchesStatus = status
        ? caseItem.status.toLowerCase() === status.toLowerCase()
        : true;

      return matchesDateRange && matchesSearchTerm && matchesStatus;
    });
  }, [filters, baggageCases]);

  const updateCase = useCallback(
    async (updatedCase: BaggageCase) => {
      try {
        const session = await getSession();
        const sessionToken = session?.user.access_token as string; 
        if (!sessionToken) {
          throw new Error("Token de sesión no disponible.");
        }

        await putBaggageCasesAPI(updatedCase.id, updatedCase, sessionToken);
        setBaggageCases((prev) =>
          prev.map((item) => (item.id === updatedCase.id ? updatedCase : item))
        );
      } catch (error) {
        console.error("Error al actualizar el caso:", error);
      }
    },
    []
  );

  const deleteCases = useCallback(
    async (ids: string[]) => {
      try {
        const session = await getSession();
        const sessionToken = session?.user.access_token as string; // Token de la sesión
        if (!sessionToken) {
          throw new Error("Token de sesión no disponible.");
        }

        await deleteBaggageCasesAPI(ids, sessionToken);
        setBaggageCases((prev) =>
          prev.filter((item) => !ids.includes(item.id))
        );
      } catch (error) {
        console.error("Error al eliminar los casos:", error);
      }
    },
    []
  );

  const setFilter = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return {
    loading,
    filters,
    filteredCases,
    setFilter,
    updateCase,
    deleteCases,
    uploadImage, // Exponemos la función para que pueda ser usada en el componente
  };
};
