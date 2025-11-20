import { useHouseholdSafety } from '@/hooks/useHouseholdSafety';
import { formatDate } from '@/lib/utils';
import type {
    SafetyLevel,
    SafetySearchResponse,
    SafetySearchResult
} from '@/types/household-safety';
import { SPECIES_OPTIONS } from '@/types/household-safety';
import { ExclamationCircleOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import {
    Alert,
    Badge,
    Button,
    Card,
    Input,
    Modal,
    Pagination,
    Select,
    Space,
    Spin,
    Table,
    Tabs,
    Typography
} from 'antd';
import { useEffect, useMemo, useState } from 'react';

const { Title, Text } = Typography;
const { Option } = Select;

function HouseholdSafetyPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(15);
  const [selectedItem, setSelectedItem] = useState<SafetySearchResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const { 
    searchSafetyItems,
    getFoods,
    getPlants,
    getHouseholdItems,
    loading,
    error 
  } = useHouseholdSafety();

  const [results, setResults] = useState<SafetySearchResult[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const loadData = async () => {
    let data: SafetySearchResponse | null = null;

    if (activeTab === 'all') {
      data = await searchSafetyItems(searchTerm.trim(), selectedSpecies, currentPage, pageSize);
    } else if (activeTab === 'foods') {
      data = await getFoods(selectedSpecies === 'all' ? undefined : selectedSpecies, currentPage, pageSize);
    } else if (activeTab === 'plants') {
      data = await getPlants(selectedSpecies === 'all' ? undefined : selectedSpecies, currentPage, pageSize);
    } else if (activeTab === 'household') {
      data = await getHouseholdItems(selectedSpecies === 'all' ? undefined : selectedSpecies, currentPage, pageSize);
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
      'safe': 'success',
      'non-toxic': 'success',
      'low': 'success',
      'caution': 'warning',
      'mild': 'warning',
      'medium': 'warning',
      'dangerous': 'error',
      'moderate': 'error',
      'severe': 'error',
      'high': 'error',
      'unknown': 'default',
    };

    return colorMap[level] || 'default';
  };

  const getItemTypeIcon = (type: string) => {
    const icons = {
      food: '🍎',
      plant: '🌿',
      household: '🏠',
    };
    return icons[type as keyof typeof icons] || '📋';
  };

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (_: unknown, record: SafetySearchResult) => (
        <span className="text-lg">{getItemTypeIcon(record.type)}</span>
      ),
    },
    {
      title: 'Item Name',
      dataIndex: 'name',
      key: 'name',
      render: (_: unknown, record: SafetySearchResult) => (
        <div>
          <div className="font-semibold">{record.name}</div>
          {record.category && (
            <div className="text-sm text-gray-500">{record.category}</div>
          )}
        </div>
      ),
    },
    {
      title: 'Safety Level',
      key: 'safety',
      width: 200,
      render: (_: unknown, record: SafetySearchResult) => (
        <Space size="small" wrap>
          {record.safetyLevel && (
            <Badge 
              color={getSafetyBadgeColor(record.safetyLevel as SafetyLevel)}
              text={record.safetyLevel}
            />
          )}
          {record.toxicityLevel && (
            <Badge 
              color={getSafetyBadgeColor(record.toxicityLevel as SafetyLevel)}
              text={record.toxicityLevel}
            />
          )}
          {record.hazardLevel && (
            <Badge 
              color={getSafetyBadgeColor(record.hazardLevel as SafetyLevel)}
              text={record.hazardLevel}
            />
          )}
        </Space>
      ),
    },
    {
      title: 'Species Info',
      key: 'species',
      width: 250,
      render: (_: unknown, record: SafetySearchResult) => (
        record.speciesSafety && record.speciesSafety.length > 0 ? (
          <div className="space-y-1">
            {record.speciesSafety.slice(0, 3).map((safety, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <Badge 
                  color={safety.safety === 'safe' ? 'success' : 'error'}
                  text={`${safety.species}: ${safety.safety}`}
                />
              </div>
            ))}
            {record.speciesSafety.length > 3 && (
              <div className="text-xs text-gray-500">
                +{record.speciesSafety.length - 3} more species
              </div>
            )}
          </div>
        ) : (
          <span className="text-sm text-gray-500">No species data</span>
        )
      ),
    },
    {
      title: 'Added',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: Date) => (
        <span className="text-sm text-gray-500">{formatDate(date)}</span>
      ),
    },
    {
      title: 'Details',
      key: 'actions',
      width: 80,
      align: 'center' as const,
      render: (_: unknown, record: SafetySearchResult) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          size="small"
          onClick={() => {
            setSelectedItem(record);
            setShowDetails(true);
          }}
        />
      ),
    },
  ];

  // Extract tab content into items array
  const tabItems = [
    {
      key: 'all',
      label: 'All Items',
      children: (
        <div className="space-y-4">
          <Title level={4}>All Safety Items</Title>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Text strong>Search items</Text>
              <Input
                placeholder="Search for foods, plants, or household items..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                prefix={<SearchOutlined />}
                className="mt-1"
              />
            </div>
            <div>
              <Text strong>Filter by species</Text>
              <Select 
                value={selectedSpecies} 
                onChange={(value) => {
                  setSelectedSpecies(value);
                  setCurrentPage(1);
                }}
                className="w-full mt-1"
              >
                {SPECIES_OPTIONS.map(species => (
                  <Option key={species.value} value={species.value}>
                    {species.label}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'foods',
      label: '🍎 Foods',
      children: (
        <div className="space-y-4">
          <Title level={4}>Foods Safety</Title>
          <div>
            <Text strong>Filter by species</Text>
            <Select 
              value={selectedSpecies} 
              onChange={(value) => {
                setSelectedSpecies(value);
                setCurrentPage(1);
              }}
              className="w-full mt-1"
            >
              {SPECIES_OPTIONS.map(species => (
                <Option key={species.value} value={species.value}>
                  {species.label}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      ),
    },
    {
      key: 'plants',
      label: '🌿 Plants',
      children: (
        <div className="space-y-4">
          <Title level={4}>Plants Safety</Title>
          <div>
            <Text strong>Filter by species</Text>
            <Select 
              value={selectedSpecies} 
              onChange={(value) => {
                setSelectedSpecies(value);
                setCurrentPage(1);
              }}
              className="w-full mt-1"
            >
              {SPECIES_OPTIONS.map(species => (
                <Option key={species.value} value={species.value}>
                  {species.label}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      ),
    },
    {
      key: 'household',
      label: '🏠 Household',
      children: (
        <div className="space-y-4">
          <Title level={4}>Household Safety</Title>
          <div>
            <Text strong>Filter by species</Text>
            <Select 
              value={selectedSpecies} 
              onChange={(value) => {
                setSelectedSpecies(value);
                setCurrentPage(1);
              }}
              className="w-full mt-1"
            >
              {SPECIES_OPTIONS.map(species => (
                <Option key={species.value} value={species.value}>
                  {species.label}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <Alert
            message="Error"
            description={
              <div>
                {error.message}
                <Button 
                  type="default" 
                  size="small" 
                  onClick={() => loadData()}
                  className="mt-2"
                >
                  Retry
                </Button>
              </div>
            }
            type="error"
            showIcon
            icon={<ExclamationCircleOutlined />}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
        <div>
          <Title level={2}>Household Safety Database</Title>
          <Text type="secondary">
            Browse safety information for foods, plants, and household items across different pet species
          </Text>
        </div>
      </div>

      {/* Tabs */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      </Card>

      {/* Results Table */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Title level={4}>
            {activeTab === 'all' 
              ? `All Items (${totalCount})` 
              : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Items (${totalCount})`
            }
          </Title>
          <Text type="secondary">
            Page {currentPage} of {Math.ceil(totalCount / pageSize)}
          </Text>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spin size="large" />
            <Text className="ml-2">Loading safety information...</Text>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="text-center py-12">
            <ExclamationCircleOutlined className="text-4xl text-gray-400 mb-4" />
            <Title level={4}>
              No items found
            </Title>
            <Text type="secondary" className="block mb-4">
              {activeTab === 'all' 
                ? 'No items found matching your criteria' 
                : `No ${activeTab} items found for the selected filters`
              }
            </Text>
          </div>
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={filteredResults}
              rowKey="id"
              pagination={false}
            />
            {totalCount > pageSize && (
              <div className="mt-4 flex justify-center">
                <Pagination
                  current={currentPage}
                  total={totalCount}
                  pageSize={pageSize}
                  onChange={(page) => setCurrentPage(page)}
                  showSizeChanger={false}
                />
              </div>
            )}
          </>
        )}
      </Card>

      {/* Item Details Modal */}
      <Modal
        open={showDetails}
        onCancel={() => setShowDetails(false)}
        title="Safety Information Details"
        width={800}
        footer={null}
      >
        {selectedItem && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="text-3xl flex-shrink-0">
                {getItemTypeIcon(selectedItem.type)}
              </div>
              <div className="flex-1 min-w-0">
                <Title level={3}>{selectedItem.name}</Title>
                <Space size="small" wrap className="mt-2">
                  {selectedItem.safetyLevel && (
                    <Badge 
                      color={getSafetyBadgeColor(selectedItem.safetyLevel as SafetyLevel)}
                      text={selectedItem.safetyLevel}
                    />
                  )}
                  {selectedItem.toxicityLevel && (
                    <Badge 
                      color={getSafetyBadgeColor(selectedItem.toxicityLevel as SafetyLevel)}
                      text={selectedItem.toxicityLevel}
                    />
                  )}
                  {selectedItem.hazardLevel && (
                    <Badge 
                      color={getSafetyBadgeColor(selectedItem.hazardLevel as SafetyLevel)}
                      text={selectedItem.hazardLevel}
                    />
                  )}
                </Space>
                {selectedItem.category && (
                  <Text type="secondary" className="block mt-1">{selectedItem.category}</Text>
                )}
              </div>
            </div>

            {/* Species Safety */}
            {selectedItem.speciesSafety && selectedItem.speciesSafety.length > 0 && (
              <Card title="Safety by Species">
                <div className="space-y-3">
                  {selectedItem.speciesSafety.map((safety, index) => (
                    <div key={index} className="p-3 rounded-lg border bg-gray-50">
                      <div className="flex items-center gap-2">
                        <Title level={5} className="mb-0 capitalize">{safety.species}</Title>
                        <Badge 
                          color={safety.safety === 'safe' ? 'success' : safety.safety === 'caution' ? 'warning' : 'error'}
                          text={safety.safety}
                        />
                      </div>
                      {safety.notes && (
                        <Text type="secondary" className="block mt-1">{safety.notes}</Text>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* General Information */}
            <Card title="General Information">
              <div className="space-y-4">
                {selectedItem.type === 'food' && (
                  <div>
                    <Title level={5}>Food Safety Notes</Title>
                    <Text type="secondary">
                      This food item has been evaluated for pet consumption. Always consult with a veterinarian for specific dietary recommendations.
                    </Text>
                  </div>
                )}

                {selectedItem.type === 'plant' && (
                  <div>
                    <Title level={5}>Plant Toxicity</Title>
                    <div className="space-y-2">
                      <Text type="secondary">
                        This plant's toxicity varies by species and exposure level. Immediate veterinary attention is recommended for ingestion.
                      </Text>
                      {selectedItem.toxicityLevel === 'severe' && (
                        <Alert
                          message="High Risk"
                          description="Severe toxicity - contact poison control or emergency vet immediately if ingested"
                          type="error"
                          showIcon
                          className="mt-2"
                        />
                      )}
                    </div>
                  </div>
                )}

                {selectedItem.type === 'household' && (
                  <div>
                    <Title level={5}>Household Hazard Precautions</Title>
                    <div className="space-y-2">
                      <Text type="secondary">
                        Keep this item out of reach of pets. Consider pet-safe alternatives when possible.
                      </Text>
                      {selectedItem.hazardLevel === 'high' && (
                        <Alert
                          message="High Hazard"
                          description="Store securely and never leave accessible to pets"
                          type="warning"
                          showIcon
                          className="mt-2"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Text type="secondary">Type:</Text>
                <div className="capitalize font-medium">{selectedItem.type}</div>
              </div>
              <div>
                <Text type="secondary">Added:</Text>
                <div className="font-medium">{formatDate(selectedItem.createdAt)}</div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export { HouseholdSafetyPage };
export default HouseholdSafetyPage;
