import { BaggageCase } from "@/domain/types/BaggageCase";

export interface BaggageTableProps {
  rows: BaggageCase[];
  onSaveChanges: (updatedRows: BaggageCase[]) => void;
  onEdit: (id: string) => void;
  onCancel: (id: string) => void;
  searchTerm: string;
  status: string;
  startDate: string;
  endDate: string;
}