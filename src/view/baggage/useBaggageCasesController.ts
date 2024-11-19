import { useState, useEffect, useMemo } from "react";
import { getSession } from "next-auth/react";
import {
  getBaggageCasesApi,
  putBaggageCasesAPI,
  deleteBaggageCasesAPI,
} from "@/data/api/baggageAPI";
import { BaggageCase } from "@/domain/types/BaggageCase";

export const useBaggageCasesController = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [baggageCases, setBaggageCases] = useState<BaggageCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBaggageDetails, setSelectedBaggageDetails] = useState<BaggageCase | null>(null);

  useEffect(() => {
    const fetchBaggageCases = async () => {
      const session = await getSession();
      const token = session?.user.access_token as string;
      const data = await getBaggageCasesApi(token);
      setBaggageCases(data);
      setLoading(false);
    };
    fetchBaggageCases();
  }, []);

  const filteredData = useMemo(() => {
    const start = startDate || "1900-01-01";
    const end = endDate || new Date().toISOString().split("T")[0];

    return baggageCases.filter((row) => {
      const rowDate = row.date_create
        ? new Date(row.date_create).toISOString().split("T")[0]
        : null;

      const matchesSearchTerm =
        !searchTerm ||
        (row.pnr && row.pnr.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.passenger_name && row.passenger_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.status && row.status.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.baggage_code && row.baggage_code.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatusFilter = !statusFilter || (row.status && row.status.toLowerCase() === statusFilter.toLowerCase());

      const matchesDateRange = !rowDate || (rowDate >= start && rowDate <= end);

      return matchesSearchTerm && matchesStatusFilter && matchesDateRange;
    });
  }, [searchTerm, statusFilter, startDate, endDate, baggageCases]);

  const updatedSavedBaggageCase = async (updatedCase: BaggageCase) => {
    const session = await getSession();
    const token = session?.user.access_token as string;
    await putBaggageCasesAPI(updatedCase.id, updatedCase, token);

    setBaggageCases((prevState) =>
      prevState.map((caseItem) =>
        caseItem.id === updatedCase.id ? { ...caseItem, ...updatedCase } : caseItem
      )
    );
    handleCloseModal();
  };

  const handleDeleteSelected = async (selectedCases: BaggageCase[]) => {
    const ids = selectedCases.map((c) => c.id);
    const session = await getSession();
    const token = session?.user.access_token as string;

    await deleteBaggageCasesAPI(ids, token);
    setBaggageCases((prevState) =>
      prevState.filter((caseItem) => !ids.includes(caseItem.id))
    );
  };

  const handleOpenModal = (details: BaggageCase) => {
    setSelectedBaggageDetails(details);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBaggageDetails(null);
  };

  return {
    searchTerm,
    statusFilter,
    startDate,
    endDate,
    filteredData,
    loading,
    setSearchTerm,
    setStatusFilter,
    setStartDate,
    setEndDate,
    isModalOpen,
    selectedBaggageDetails,
    handleOpenModal,
    handleCloseModal,
    updatedSavedBaggageCase,
    handleDeleteSelected,
  };
};
