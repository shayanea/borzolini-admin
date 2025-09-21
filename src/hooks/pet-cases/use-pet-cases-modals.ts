import { ClinicPetCase } from '@/types/pet-cases';
import { useCallback, useState } from 'react';

export const usePetCasesModals = () => {
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCase, setSelectedCase] = useState<ClinicPetCase | null>(null);

  const handleViewCase = useCallback((caseData: ClinicPetCase) => {
    setSelectedCase(caseData);
    setViewModalVisible(true);
  }, []);

  const handleEditCase = useCallback((caseData: ClinicPetCase) => {
    setSelectedCase(caseData);
    setEditModalVisible(true);
  }, []);

  const handleCloseViewModal = useCallback(() => {
    setViewModalVisible(false);
    setSelectedCase(null);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setEditModalVisible(false);
    setSelectedCase(null);
  }, []);

  const handleEditSuccess = useCallback(() => {
    setEditModalVisible(false);
    setSelectedCase(null);
  }, []);

  return {
    viewModalVisible,
    editModalVisible,
    selectedCase,
    handleViewCase,
    handleEditCase,
    handleCloseViewModal,
    handleCloseEditModal,
    handleEditSuccess,
  };
};
