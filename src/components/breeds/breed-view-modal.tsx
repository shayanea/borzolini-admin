import { formatDate } from '@/lib/utils';
import type { Breed } from '@/types/breeds';
import { Badge, Modal, Typography } from 'antd';

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
    <Modal
      open={open}
      onCancel={onClose}
      title="Breed Details"
      footer={null}
      width={900}
    >
      <div className="space-y-4">
        <div>
          <Title level={4}>{breed.name}</Title>
          <Text type="secondary" className="block mt-1">{breed.description}</Text>
        </div>
        {breed.image_url && (
          <div>
            <Text type="secondary" className="block mb-2">Breed Image</Text>
            <div className="mb-4">
              <img
                src={breed.image_url}
                alt={breed.name}
                className="max-w-full h-auto rounded-lg border object-cover"
                style={{ maxHeight: '400px' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <Text type="secondary">Species</Text>
            <div className="capitalize">
              <Badge color={getSpeciesColor(breed.species)} text={breed.species} />
            </div>
          </div>
          <div>
            <Text type="secondary">Status</Text>
            <div>
              <Badge color={breed.is_active ? 'success' : 'default'} text={breed.is_active ? 'Active' : 'Inactive'} />
            </div>
          </div>
          {breed.size_category && (
            <div>
              <Text type="secondary">Size Category</Text>
              <div className="capitalize">{breed.size_category}</div>
            </div>
          )}
          {breed.grooming_needs && (
            <div>
              <Text type="secondary">Grooming Needs</Text>
              <div className="capitalize">{breed.grooming_needs}</div>
            </div>
          )}
          {breed.exercise_needs && (
            <div>
              <Text type="secondary">Exercise Needs</Text>
              <div className="capitalize">{breed.exercise_needs}</div>
            </div>
          )}
          {breed.life_expectancy_min && breed.life_expectancy_max && (
            <div>
              <Text type="secondary">Life Expectancy</Text>
              <div>{breed.life_expectancy_min} - {breed.life_expectancy_max} years</div>
            </div>
          )}
          {breed.weight_min && breed.weight_max && (
            <div>
              <Text type="secondary">Weight Range</Text>
              <div>{breed.weight_min} - {breed.weight_max} lbs</div>
            </div>
          )}
          {breed.origin_country && (
            <div>
              <Text type="secondary">Origin Country</Text>
              <div>{breed.origin_country}</div>
            </div>
          )}
          <div>
            <Text type="secondary">Created</Text>
            <div>{formatDate(breed.created_at)}</div>
          </div>
        </div>
        {breed.temperament && (
          <div>
            <Text type="secondary" className="block mb-2">Temperament</Text>
            <Text>{breed.temperament}</Text>
          </div>
        )}
        {breed.origin_history && (
          <div>
            <Text type="secondary" className="block mb-2">Origin History</Text>
            <Text>{breed.origin_history}</Text>
          </div>
        )}
        {breed.health_risks && breed.health_risks.length > 0 && (
          <div>
            <Text type="secondary" className="block mb-2">Health Risks</Text>
            <div className="flex flex-wrap gap-2">
              {breed.health_risks.map((risk, index) => (
                <Badge key={index} text={risk} />
              ))}
            </div>
          </div>
        )}
        {breed.resources && breed.resources.length > 0 && (
          <div>
            <Text type="secondary" className="block mb-2">Resources</Text>
            <div className="space-y-1">
              {breed.resources.map((resource, index) => (
                <div key={index}>
                  <a 
                    href={resource} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {resource}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

