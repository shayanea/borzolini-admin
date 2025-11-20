import { Badge, Modal, Typography } from 'antd';
import type { Resource } from '@/types/resources';
import { formatDate } from '@/lib/utils';

const { Title, Text } = Typography;

interface ResourceViewModalProps {
  resource: Resource | null;
  open: boolean;
  onClose: () => void;
  getTypeColor: (type: string) => 'blue' | 'green' | 'orange' | 'purple' | 'pink' | 'default';
}

export function ResourceViewModal({
  resource,
  open,
  onClose,
  getTypeColor,
}: ResourceViewModalProps) {
  if (!resource) return null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Resource Details"
      footer={null}
      width={800}
    >
      <div className="space-y-4">
        <div>
          <Title level={4}>{resource.title}</Title>
          <Text type="secondary" className="block mt-1">{resource.description}</Text>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <Text type="secondary">Type</Text>
            <div className="capitalize">
              <Badge color={getTypeColor(resource.type)} text={resource.type} />
            </div>
          </div>
          <div>
            <Text type="secondary">Status</Text>
            <div>
              <Badge color={resource.is_active ? 'success' : 'default'} text={resource.is_active ? 'Active' : 'Inactive'} />
            </div>
          </div>
          {resource.cover && (
            <div>
              <Text type="secondary">Cover Image</Text>
              <div>
                <a 
                  href={resource.cover} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Cover
                </a>
              </div>
            </div>
          )}
          <div>
            <Text type="secondary">Created</Text>
            <div>{formatDate(resource.created_at)}</div>
          </div>
        </div>
        {resource.url && (
          <div>
            <Text type="secondary">URL</Text>
            <div>
              <a 
                href={resource.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {resource.url}
              </a>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

