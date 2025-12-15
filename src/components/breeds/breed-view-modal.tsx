import { BaseModal } from '@/components/common';
import { formatDate } from '@/lib/utils';
import type { Breed } from '@/types/breeds';
import { Badge, Tag, Typography } from 'antd';

const { Title, Text } = Typography;

interface BreedViewModalProps {
  breed: Breed | null;
  open: boolean;
  onClose: () => void;
  getSpeciesColor: (species: string) => 'blue' | 'green' | 'orange' | 'purple' | 'pink' | 'cyan' | 'lime' | 'gold' | 'default';
}

export function BreedViewModal({
  breed,
  open,
  onClose,
  getSpeciesColor,
}: BreedViewModalProps) {
  if (!breed) return null;

  return (
    <BaseModal
      open={open}
      onCancel={onClose}
      onOk={onClose}
      title={
        <div className="flex items-center gap-3">
          <span>Breed Details</span>
          <Badge 
            status={breed.is_active ? 'success' : 'default'} 
            text={breed.is_active ? 'Active' : 'Inactive'} 
            className="text-sm font-normal opacity-80"
          />
        </div>
      }
      footer={null}
      width={1000}
      style={{ top: 20 }}
    >
      <div className="space-y-8 py-2">
        {/* Header Section: Image & Description */}
        <div className="flex flex-col md:flex-row gap-6">
          {breed.image_url && (
            <div className="w-full md:w-1/3 flex-shrink-0">
              <div className="relative rounded-xl overflow-hidden border shadow-sm group bg-gray-50">
                <img
                  src={breed.image_url}
                  alt={breed.name}
                  className="w-full h-64 md:h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}
          
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Title level={2} style={{ margin: 0 }}>{breed.name}</Title>
                <Tag color={getSpeciesColor(breed.species)} className="capitalize text-sm px-2 py-0.5 m-0 rounded-full">
                  {breed.species}
                </Tag>
              </div>
              <Text className="text-gray-600 text-lg leading-relaxed block">
                {breed.description}
              </Text>
            </div>

            {breed.temperament && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <Text type="secondary" className="block text-xs uppercase tracking-wider font-semibold mb-1 text-blue-600">
                  Temperament
                </Text>
                <Text className="text-gray-800 italic">"{breed.temperament}"</Text>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              {breed.origin_country && (
                <div>
                  <Text type="secondary" className="text-xs">Origin</Text>
                  <div className="font-medium">{breed.origin_country}</div>
                </div>
              )}
              <div>
                <Text type="secondary" className="text-xs">Added</Text>
                <div className="font-medium">{formatDate(breed.created_at)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t paddingTop-6">
            {/* Left Column: Stats & Vitals */}
            <div className="space-y-6">
                {/* Physical Attributes */}
                <section>
                    <Title level={5} className="mb-4">Physical Attributes</Title>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                        {breed.size_category && (
                            <div>
                                <Text type="secondary" className="block text-xs">Size</Text>
                                <span className="capitalize font-medium">{breed.size_category}</span>
                            </div>
                        )}
                         {(breed.life_expectancy_min || breed.life_expectancy_max) && (
                            <div>
                                <Text type="secondary" className="block text-xs">Life Expectancy</Text>
                                <span className="font-medium">
                                    {breed.life_expectancy_min && breed.life_expectancy_max 
                                        ? `${breed.life_expectancy_min} - ${breed.life_expectancy_max} years`
                                        : `${breed.life_expectancy_min || breed.life_expectancy_max} years`}
                                </span>
                            </div>
                        )}
                        {(breed.weight_min || breed.weight_max) && (
                            <div>
                                <Text type="secondary" className="block text-xs">Weight (Range)</Text>
                                <span className="font-medium">
                                    {breed.weight_min} - {breed.weight_max} kg
                                </span>
                            </div>
                        )}
                         {breed.grooming_needs && (
                            <div>
                                <Text type="secondary" className="block text-xs">Grooming</Text>
                                <span className="capitalize font-medium">{breed.grooming_needs}</span>
                            </div>
                        )}
                        {breed.exercise_needs && (
                            <div>
                                <Text type="secondary" className="block text-xs">Exercise</Text>
                                <span className="capitalize font-medium">{breed.exercise_needs}</span>
                            </div>
                        )}
                    </div>
                </section>
                
                 {/* Average Vitals */}
                {breed.average_vitals && (
                    <section>
                        <Title level={5} className="mb-4">Average Vitals</Title>
                        <div className="grid grid-cols-2 gap-3">
                            {breed.average_vitals.weight_kg && (
                                <div className="bg-gray-50 p-3 rounded-md">
                                    <Text type="secondary" className="block text-xs mb-1">Target Weight</Text>
                                    <div className="font-medium">
                                        {breed.average_vitals.weight_kg.min} - {breed.average_vitals.weight_kg.max} kg
                                    </div>
                                </div>
                            )}
                            {breed.average_vitals.temperature_f && (
                                <div className="bg-gray-50 p-3 rounded-md">
                                    <Text type="secondary" className="block text-xs mb-1">Temperature</Text>
                                    <div className="font-medium">
                                        {breed.average_vitals.temperature_f.min} - {breed.average_vitals.temperature_f.max}°F
                                    </div>
                                </div>
                            )}
                            {breed.average_vitals.heart_rate_bpm && (
                                <div className="bg-gray-50 p-3 rounded-md">
                                    <Text type="secondary" className="block text-xs mb-1">Heart Rate</Text>
                                    <div className="font-medium">
                                        {breed.average_vitals.heart_rate_bpm.min} - {breed.average_vitals.heart_rate_bpm.max} bpm
                                    </div>
                                </div>
                            )}
                            {breed.average_vitals.respiratory_rate_rpm && (
                                <div className="bg-gray-50 p-3 rounded-md">
                                    <Text type="secondary" className="block text-xs mb-1">Respiratory Rate</Text>
                                    <div className="font-medium">
                                        {breed.average_vitals.respiratory_rate_rpm.min} - {breed.average_vitals.respiratory_rate_rpm.max} rpm
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </div>

            {/* Right Column: Care & Risks */}
            <div className="space-y-6">
                {/* Care Specifics */}
                {breed.care_specifics && (
                    <section>
                        <Title level={5} className="mb-4">Care Requirements</Title>
                        <div className="space-y-4">
                            <div>
                                <Text type="secondary" className="block text-xs uppercase font-semibold mb-1">Diet</Text>
                                <p className="text-gray-800 text-sm leading-relaxed">{breed.care_specifics.diet}</p>
                            </div>
                            <div>
                                <Text type="secondary" className="block text-xs uppercase font-semibold mb-1">Housing</Text>
                                <p className="text-gray-800 text-sm leading-relaxed">{breed.care_specifics.housing}</p>
                            </div>
                            <div>
                                <Text type="secondary" className="block text-xs uppercase font-semibold mb-1">Social Needs</Text>
                                <p className="text-gray-800 text-sm leading-relaxed">{breed.care_specifics.social_needs}</p>
                            </div>
                            {breed.care_specifics.common_stressors && breed.care_specifics.common_stressors.length > 0 && (
                                <div>
                                    <Text type="secondary" className="block text-xs uppercase font-semibold mb-2">Common Stressors</Text>
                                    <div className="flex flex-wrap gap-2">
                                        {breed.care_specifics.common_stressors.map((stressor, idx) => (
                                            <Tag key={idx} color="orange">
                                                {stressor}
                                            </Tag>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )}
                
                {/* Health Risks */}
                {breed.health_risks && breed.health_risks.length > 0 && (
                    <section>
                        <Title level={5} className="mb-4">Health Risks</Title>
                        <div className="flex flex-wrap gap-2">
                             {breed.health_risks.map((risk, index) => (
                                <Tag key={index} color="red">
                                    {risk}
                                </Tag>
                              ))}
                        </div>
                    </section>
                )}

                 {/* Historical Context */}
                {breed.origin_history && (
                    <section>
                        <Title level={5} className="mb-4">Historical Context</Title>
                        <Text className="text-gray-600 text-sm leading-relaxed block bg-gray-50 p-3 rounded-lg border">
                            {breed.origin_history}
                        </Text>
                    </section>
                )}
            </div>
        </div>

        {/* Footer: Resources */}
        {breed.resources && breed.resources.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-4 mt-2">
            <Text type="secondary" className="block text-xs uppercase font-semibold mb-3">Additional Resources</Text>
            <div className="flex flex-wrap gap-3">
              {breed.resources.map((resource, index) => (
                <a 
                  key={index}
                  href={resource} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-md border border-gray-200 bg-white shadow-sm transition-all text-sm"
                >
                  <span className="truncate max-w-xs">{resource}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  );
}
