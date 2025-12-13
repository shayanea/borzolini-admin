import { Alert, Button, Card } from 'antd';
import {
  HouseholdSafetyFilters,
  HouseholdSafetyPageHeader,
  HouseholdSafetyTable,
  HouseholdSafetyViewModal,
} from '@/components/household-safety';
import type {
  SafetyLevel,
  SafetySearchResponse,
  SafetySearchResult,
} from '@/types/household-safety';
import { useEffect, useMemo, useState } from 'react';

import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useHouseholdSafety } from '@/hooks/common';

function HouseholdSafetyPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(15);
  const [selectedItem, setSelectedItem] = useState<SafetySearchResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const { searchSafetyItems, getFoods, getPlants, getHouseholdItems, loading, error } =
    useHouseholdSafety();

  const [results, setResults] = useState<SafetySearchResult[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const loadData = async () => {
    let data: SafetySearchResponse | null = null;

    if (activeTab === 'all') {
      data = await searchSafetyItems(searchTerm.trim(), selectedSpecies, currentPage, pageSize);
    } else if (activeTab === 'foods') {
      data = await getFoods(
        selectedSpecies === 'all' ? undefined : selectedSpecies,
        currentPage,
        pageSize
      );
    } else if (activeTab === 'plants') {
      data = await getPlants(
        selectedSpecies === 'all' ? undefined : selectedSpecies,
        currentPage,
        pageSize
      );
    } else if (activeTab === 'household') {
      data = await getHouseholdItems(
        selectedSpecies === 'all' ? undefined : selectedSpecies,
        currentPage,
        pageSize
      );
    }

    if (data) {
      setResults(data.data);
      setTotalCount(data.total);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab, searchTerm, selectedSpecies, currentPage]);

  const filteredResults = useMemo(() => {
    return results;
  }, [results]);

  const getSafetyBadgeColor = (level?: SafetyLevel) => {
    if (!level) return 'default';

    const colorMap: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
      safe: 'success',
      'non-toxic': 'success',
      low: 'success',
      caution: 'warning',
      mild: 'warning',
      medium: 'warning',
      dangerous: 'error',
      moderate: 'error',
      severe: 'error',
      high: 'error',
      avoid: 'error',
      unknown: 'default',
    };

    return colorMap[level] || 'default';
  };

  const getItemTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      food: '🍎',
      plant: '🌿',
      household: '🏠',
    };
    return icons[type] || '📋';
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleSpeciesChange = (value: string) => {
    setSelectedSpecies(value);
    setCurrentPage(1);
  };

  const handleView = (item: SafetySearchResult) => {
    setSelectedItem(item);
    setShowDetails(true);
  };

  const handleCloseModal = () => {
    setShowDetails(false);
    setSelectedItem(null);
  };

  if (error) {
    return (
      <div className='space-y-6'>
        <Card>
          <Alert
            message='Error'
            description={
              <div>
                {error.message}
                <Button type='default' size='small' onClick={() => loadData()} className='mt-2'>
                  Retry
                </Button>
              </div>
            }
            type='error'
            showIcon
            icon={<ExclamationCircleOutlined />}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <HouseholdSafetyPageHeader totalCount={totalCount} />

      <HouseholdSafetyFilters
        activeTab={activeTab}
        searchTerm={searchTerm}
        selectedSpecies={selectedSpecies}
        onTabChange={handleTabChange}
        onSearchChange={handleSearchChange}
        onSpeciesChange={handleSpeciesChange}
      />

      <HouseholdSafetyTable
        results={filteredResults}
        loading={loading}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        activeTab={activeTab}
        onPageChange={setCurrentPage}
        onView={handleView}
        getSafetyBadgeColor={getSafetyBadgeColor}
        getItemTypeIcon={getItemTypeIcon}
      />

      <HouseholdSafetyViewModal
        item={selectedItem}
        open={showDetails}
        onClose={handleCloseModal}
        getSafetyBadgeColor={getSafetyBadgeColor}
        getItemTypeIcon={getItemTypeIcon}
      />
    </div>
  );
}

export { HouseholdSafetyPage };
export default HouseholdSafetyPage;
