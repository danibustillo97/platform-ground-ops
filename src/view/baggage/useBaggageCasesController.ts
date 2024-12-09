import { useState, useEffect, useMemo, useCallback } from "react";
import { getSession } from "next-auth/react";
import {
  getBaggageCasesApi,
  putBaggageCasesAPI,
  deleteBaggageCasesAPI,
} from "@/data/api/baggageAPI";
import { BaggageCase } from "@/domain/types/BaggageCase";



export const useBaggageCasesController = () => {
  const [baggageCases, setBaggageCases] = useState<BaggageCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    searchTerm: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  // Función para cargar casos desde la API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const session = await getSession();
        const token = session?.user.access_token as string;
        const data = await getBaggageCasesApi(token);
        setBaggageCases(data);
      } catch (error) {
        console.error("Error al cargar los casos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtro memoizado
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
            return typeof fieldValue === "string" && fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
          })
        : true;

      const matchesStatus = status
        ? caseItem.status.toLowerCase() === status.toLowerCase()
        : true;

      return matchesDateRange && matchesSearchTerm && matchesStatus;
    });
  }, [filters, baggageCases]);

  // Actualizar un caso
  const updateCase = useCallback(
    async (updatedCase: BaggageCase) => {
      try {
        const session = await getSession();
        const token = session?.user.access_token as string;
        await putBaggageCasesAPI(updatedCase.id, updatedCase, token);

        setBaggageCases((prev) =>
          prev.map((item) => (item.id === updatedCase.id ? updatedCase : item))
        );
      } catch (error) {
        console.error("Error al actualizar el caso:", error);
      }
    },
    []
  );

  // Eliminar casos
  const deleteCases = useCallback(
    async (ids: string[]) => {
      try {
        const session = await getSession();
        const token = session?.user.access_token as string;
        await deleteBaggageCasesAPI(ids, token);

        setBaggageCases((prev) =>
          prev.filter((item) => !ids.includes(item.id))
        );
      } catch (error) {
        console.error("Error al eliminar los casos:", error);
      } 
    },
    []
  );

  // Establecer filtros
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
  };
};
