import { BaseModal } from '@/components/common';
import type { SafetyLevel, SafetySearchResult } from '@/types/household-safety';
import { Alert, Badge, Card, Tag, Typography } from 'antd';

import { formatDate } from '@/lib/utils';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface HouseholdSafetyViewModalProps {
  item: SafetySearchResult | null;
  open: boolean;
  onClose: () => void;
  getSafetyBadgeColor: (level?: SafetyLevel) => 'success' | 'warning' | 'error' | 'default';
  getItemTypeIcon: (type: string) => string;
}

export function HouseholdSafetyViewModal({
  item,
  open,
  onClose,
  getSafetyBadgeColor,
  getItemTypeIcon,
}: HouseholdSafetyViewModalProps) {
  if (!item) return null;

  const displayName = item.canonical_name || item.name;
  const safetyOverall = item.safety_overall || item.safetyLevel;
  const notesMarkdown = item.notes_markdown;
  const safetyBySpecies =
    item.safety_by_species ||
    item.speciesSafety?.map(s => ({
      id: '',
      species: s.species,
      safety: s.safety as 'safe' | 'caution' | 'dangerous' | 'avoid' | 'unknown',
      preparation: null,
      safeAmount: null,
      frequency: null,
      risks: [],
      emergency: false,
      treatmentInfo: null,
      citations: null,
    })) ||
    [];

  return (
    <BaseModal
      open={open}
      onCancel={onClose}
      onOk={onClose}
      title={
        <div className='flex items-center gap-3'>
          <span className='text-2xl'>{getItemTypeIcon(item.type)}</span>
          <span>Safety Information Details</span>
        </div>
      }
      footer={null}
      width={1000}
      style={{ top: 20 }}
    >
      <div className='space-y-6 py-2'>
        {/* Header Section with Quick Summary */}
        <div className='bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200'>
          <div className='flex items-start gap-4'>
            <div className='text-4xl flex-shrink-0'>{getItemTypeIcon(item.type)}</div>
            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-3 mb-2 flex-wrap'>
                <Title level={2} style={{ margin: 0 }}>
                  {displayName}
                </Title>
                {safetyOverall && (
                  <Badge
                    color={getSafetyBadgeColor(safetyOverall as SafetyLevel)}
                    text={safetyOverall.toUpperCase()}
                    className='text-lg'
                  />
                )}
              </div>
              {item.scientific_name && (
                <Text type='secondary' className='block italic mb-2 text-base'>
                  {item.scientific_name}
                </Text>
              )}
              <div className='flex gap-2 items-center flex-wrap'>
                {item.category && (
                  <Tag color='blue' className='text-sm px-3 py-1'>
                    📁 {item.category}
                  </Tag>
                )}
                {safetyBySpecies && safetyBySpecies.length > 0 && (
                  <Tag color='purple' className='text-sm px-3 py-1'>
                    🐾 {safetyBySpecies.length} Species
                  </Tag>
                )}
                {safetyBySpecies.some(s => s.risks && s.risks.length > 0) && (
                  <Tag color='red' className='text-sm px-3 py-1'>
                    ⚠️ {safetyBySpecies.reduce((sum, s) => sum + (s.risks?.length || 0), 0)} Total
                    Risks
                  </Tag>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Critical Safety Alert */}
        {(safetyOverall === 'avoid' ||
          safetyOverall === 'dangerous' ||
          safetyOverall === 'severe') && (
          <Alert
            message='⚠️ HIGH RISK - AVOID EXPOSURE'
            description='This item poses significant risks to pets. Avoid exposure completely and seek immediate veterinary attention if ingested or exposed.'
            type='error'
            showIcon
            icon={<ExclamationCircleOutlined />}
            className='text-base'
          />
        )}

        {(safetyOverall === 'caution' || safetyOverall === 'moderate') && (
          <Alert
            message='⚡ Moderate Risk - Use Caution'
            description='Exercise caution with this item. Monitor pets closely and consult a veterinarian if any adverse reactions occur.'
            type='warning'
            showIcon
            className='text-base'
          />
        )}

        {/* Safety Notes - Prominent Display */}
        {notesMarkdown && (
          <Card
            title={<span className='text-lg font-semibold'>📝 Important Safety Information</span>}
            className='shadow-md'
          >
            <div className='bg-yellow-50 p-4 rounded-lg border border-yellow-200'>
              <Text className='text-base leading-relaxed whitespace-pre-wrap'>{notesMarkdown}</Text>
            </div>
          </Card>
        )}

        {/* Safety by Species */}
        {safetyBySpecies && safetyBySpecies.length > 0 && (
          <Card
            title={
              <span className='text-lg font-semibold'>
                🐾 Species-Specific Safety Information ({safetyBySpecies.length} Species)
              </span>
            }
            className='shadow-md'
          >
            <div className='space-y-4'>
              {safetyBySpecies.map(speciesSafety => {
                const risksCount = speciesSafety.risks?.length || 0;
                return (
                  <div
                    key={speciesSafety.id || speciesSafety.species}
                    className={`p-5 rounded-lg border-2 ${
                      speciesSafety.safety === 'avoid' || speciesSafety.safety === 'dangerous'
                        ? 'bg-red-50 border-red-300'
                        : speciesSafety.safety === 'caution'
                          ? 'bg-yellow-50 border-yellow-300'
                          : 'bg-green-50 border-green-300'
                    }`}
                  >
                    <div className='flex items-center justify-between mb-3 flex-wrap gap-2'>
                      <div className='flex items-center gap-3'>
                        <Title level={4} className='mb-0 capitalize'>
                          🐕 {speciesSafety.species}
                        </Title>
                        <Badge
                          color={
                            speciesSafety.safety === 'safe'
                              ? 'success'
                              : speciesSafety.safety === 'caution'
                                ? 'warning'
                                : 'error'
                          }
                          text={speciesSafety.safety.toUpperCase()}
                          className='text-base'
                        />
                        {speciesSafety.emergency && (
                          <Tag color='red' icon={<ExclamationCircleOutlined />} className='text-sm'>
                            🚨 EMERGENCY
                          </Tag>
                        )}
                      </div>
                      {risksCount > 0 && (
                        <Tag color='red' className='text-sm'>
                          ⚠️ {risksCount} Risk{risksCount > 1 ? 's' : ''}
                        </Tag>
                      )}
                    </div>

                    {/* Risks - Prominent Display */}
                    {speciesSafety.risks && speciesSafety.risks.length > 0 && (
                      <div className='mb-4 bg-white p-4 rounded-lg border border-red-200'>
                        <Text strong className='block mb-3 text-red-700 text-base'>
                          ⚠️ Potential Risks:
                        </Text>
                        <div className='flex flex-wrap gap-2'>
                          {speciesSafety.risks.map((risk, index) => (
                            <Tag key={index} color='red' className='text-sm px-3 py-1'>
                              • {risk}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Safe Amount & Frequency */}
                    {(speciesSafety.safeAmount || speciesSafety.frequency) && (
                      <div className='grid grid-cols-2 gap-4 mb-3'>
                        {speciesSafety.safeAmount && (
                          <div>
                            <Text type='secondary' className='block text-xs'>
                              Safe Amount
                            </Text>
                            <Text className='font-medium'>{speciesSafety.safeAmount}</Text>
                          </div>
                        )}
                        {speciesSafety.frequency && (
                          <div>
                            <Text type='secondary' className='block text-xs'>
                              Frequency
                            </Text>
                            <Text className='font-medium'>{speciesSafety.frequency}</Text>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Preparation */}
                    {speciesSafety.preparation && (
                      <div className='mb-3'>
                        <Text
                          type='secondary'
                          className='block text-xs uppercase font-semibold mb-1'
                        >
                          Preparation
                        </Text>
                        <Text>{speciesSafety.preparation}</Text>
                      </div>
                    )}

                    {/* Treatment Info */}
                    {speciesSafety.treatmentInfo && (
                      <div className='mb-3'>
                        <Text
                          type='secondary'
                          className='block text-xs uppercase font-semibold mb-1'
                        >
                          Treatment Information
                        </Text>
                        <div className='bg-yellow-50 p-3 rounded border border-yellow-200'>
                          <Text>{speciesSafety.treatmentInfo}</Text>
                        </div>
                      </div>
                    )}

                    {/* Citations */}
                    {speciesSafety.citations && (
                      <div>
                        <Text
                          type='secondary'
                          className='block text-xs uppercase font-semibold mb-1'
                        >
                          Citations
                        </Text>
                        <Text className='text-sm italic'>{speciesSafety.citations}</Text>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Toxic Compounds */}
        {item.toxicCompounds && (
          <Card title='Toxic Compounds' size='small'>
            <div className='bg-red-50 p-3 rounded border border-red-200'>
              <Text>{item.toxicCompounds}</Text>
            </div>
          </Card>
        )}

        {/* Citations */}
        {item.citations && (
          <Card title='Citations' size='small'>
            <Text className='text-sm italic'>{item.citations}</Text>
          </Card>
        )}

        {/* Metadata */}
        <Card title='Metadata' size='small'>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-4 text-sm'>
            <div>
              <Text type='secondary' className='block text-xs'>
                Type
              </Text>
              <div className='capitalize font-medium'>{item.type}</div>
            </div>
            {item.category && (
              <div>
                <Text type='secondary' className='block text-xs'>
                  Category
                </Text>
                <div className='font-medium'>{item.category}</div>
              </div>
            )}
            <div>
              <Text type='secondary' className='block text-xs'>
                Created
              </Text>
              <div className='font-medium'>{formatDate(item.createdAt)}</div>
            </div>
            {item.last_reviewed_at && (
              <div>
                <Text type='secondary' className='block text-xs'>
                  Last Reviewed
                </Text>
                <div className='font-medium'>{formatDate(new Date(item.last_reviewed_at))}</div>
              </div>
            )}
            {item.sourceName && (
              <div>
                <Text type='secondary' className='block text-xs'>
                  Source
                </Text>
                <div className='font-medium'>{item.sourceName}</div>
              </div>
            )}
            {item.license && (
              <div>
                <Text type='secondary' className='block text-xs'>
                  License
                </Text>
                <div className='font-medium text-xs'>{item.license}</div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </BaseModal>
  );
}
