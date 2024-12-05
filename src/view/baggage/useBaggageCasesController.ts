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

  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const session = await getSession();
      const token = session?.user.access_token as string;
      const data = await getBaggageCasesApi(token);
      setBaggageCases(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Filter logic encapsulated
  const filteredCases = useMemo(() => {
    const { searchTerm, status, startDate, endDate } = filters;
    return baggageCases.filter((caseItem) => {
      const date = caseItem.date_create
        ? new Date(caseItem.date_create).toISOString().split("T")[0]
        : null;
      const inDateRange =
        (!startDate || (date && date >= startDate)) && (!endDate || (date && date <= endDate));

        const matchesSearch = searchTerm
        ? ["PNR", "baggage_code", "passenger_name"].some((field) => {
            const fieldValue = caseItem[field as keyof BaggageCase];
            return typeof fieldValue === 'string' && fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
          })
        : true;
      const matchesStatus = status ? caseItem.status === status : true;

      return inDateRange && matchesSearch && matchesStatus;
    });
  }, [filters, baggageCases]);

  // Handlers for API calls
  const updateCase = useCallback(
    async (updatedCase: BaggageCase) => {
      const session = await getSession();
      const token = session?.user.access_token as string;
      await putBaggageCasesAPI(updatedCase.id, updatedCase, token);

      setBaggageCases((prev) =>
        prev.map((item) => (item.id === updatedCase.id ? updatedCase : item))
      );
    },
    [setBaggageCases]
  );

  // const deleteCases = useCallback(
  //   async (ids: number[]) => {
  //     const session = await getSession();
  //     const token = session?.user.access_token as string;
  //     await deleteBaggageCasesAPI(ids.map(id => id.toString()), token); // No necesitas convertir a string
  
  //     setBaggageCases((prev) => prev.filter((item) => !ids.map(id => Number(id)).includes(item.id)));



  //   },
  //   [setBaggageCases]
  // );
  

  const setFilter = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return {
    loading,
    filters,
    filteredCases,
    setFilter,
    updateCase,
  };
};
