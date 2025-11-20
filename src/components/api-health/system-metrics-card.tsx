import { Card, Col, Progress, Row, Space, Statistic, Tag, Tooltip } from 'antd';
import {
  ClockCircleOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  HddOutlined,
  SearchOutlined,
} from '@ant-design/icons';


interface SystemInfo {
  totalMemory?: number;
  maxMemory?: number;
  uptime?: number;
}

interface DatabaseInfo {
  health?: { status?: string };
  stats?: { activeConnections?: number };
}

interface SupabaseInfo {
  status?: string;
}

interface ElasticsearchInfo {
  status?: string;
  nodeCount?: number;
  indexCount?: number;
  docsCount?: number;
  heap?: { used?: number; max?: number };
}

interface EnvironmentInfo {
  nodeEnv?: string;
  port?: string | number;
}

interface SystemMetrics {
  system?: SystemInfo;
  database?: DatabaseInfo;
  supabase?: SupabaseInfo;
  elasticsearch?: ElasticsearchInfo;
  environment?: EnvironmentInfo;
  timestamp?: string | number | Date;
}

interface SystemMetricsCardProps {
  systemMetrics: SystemMetrics;
  isLoading: boolean;
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

const getMemoryUsageColor = (used: number, total: number): string => {
  const percentage = (used / total) * 100;
  if (percentage < 50) return 'success';
  if (percentage < 80) return 'warning';
  return 'error';
};

const renderMemoryUsage = (usedMemory: number, totalMemory: number) => {
  const memoryPercentage = totalMemory > 0 ? (usedMemory / totalMemory) * 100 : 0;
  const memoryColor = getMemoryUsageColor(usedMemory, totalMemory);

  return (
    <Col xs={24} sm={12} md={8}>
      <Statistic
        title='Memory Usage'
        value={formatBytes(usedMemory)}
        suffix={`/ ${formatBytes(totalMemory)}`}
        valueStyle={{
          color:
            memoryColor === 'success'
              ? '#52c41a'
              : memoryColor === 'warning'
                ? '#faad14'
                : '#ff4d4f',
        }}
        prefix={<HddOutlined />}
      />
      <Progress
        percent={memoryPercentage}
        strokeColor={
          memoryColor === 'success' ? '#52c41a' : memoryColor === 'warning' ? '#faad14' : '#ff4d4f'
        }
        showInfo={false}
        size='small'
        className='mt-2'
      />
    </Col>
  );
};

const renderDatabaseInfo = (database: DatabaseInfo) => (
  <div className='mt-4'>
    <h4 className='text-sm font-medium text-gray-700 mb-2'>Database Connection</h4>
    <div className='bg-gray-50 p-3 rounded-lg'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
        <div>
          <span className='font-medium text-gray-600'>Status:</span>
          <Tag color={database.health?.status === 'healthy' ? 'success' : 'error'} className='ml-2'>
            {database.health?.status || 'Unknown'}
          </Tag>
        </div>
        <div>
          <span className='font-medium text-gray-600'>Connections:</span>
          <span className='ml-2'>{database.stats?.activeConnections || 0}</span>
        </div>
      </div>
    </div>
  </div>
);

const renderSupabaseInfo = (supabase: SupabaseInfo) => (
  <div className='mt-4'>
    <h4 className='text-sm font-medium text-gray-700 mb-2'>Supabase Integration</h4>
    <div className='bg-gray-50 p-3 rounded-lg'>
      <div className='text-sm'>
        <span className='font-medium text-gray-600'>Status:</span>
        <Tag color={supabase.status === 'connected' ? 'success' : 'error'} className='ml-2'>
          {supabase.status || 'Unknown'}
        </Tag>
      </div>
    </div>
  </div>
);

const getEsStatusColor = (
  status: string | undefined
): 'success' | 'warning' | 'error' | 'default' => {
  if (!status) return 'default';
  const normalized = String(status).toLowerCase();
  if (normalized === 'green' || normalized === 'healthy') return 'success';
  if (normalized === 'yellow' || normalized === 'degraded') return 'warning';
  if (normalized === 'red' || normalized === 'unhealthy') return 'error';
  return 'default';
};

const renderElasticsearchInfo = (elasticsearch: ElasticsearchInfo) => (
  <div className='mt-4'>
    <div className='flex items-center justify-between mb-2'>
      <h4 className='text-sm font-medium text-gray-700'>Elasticsearch</h4>
      <div className='flex items-center space-x-2 text-xs text-gray-500'>
        <Tooltip title='Green: Healthy cluster, all primary and replica shards allocated'>
          <Tag color='success'>Green</Tag>
        </Tooltip>
        <Tooltip title='Yellow: All primary shards allocated, but some replicas missing'>
          <Tag color='warning'>Yellow</Tag>
        </Tooltip>
        <Tooltip title='Red: Some primary shards not allocated'>
          <Tag color='error'>Red</Tag>
        </Tooltip>
      </div>
    </div>
    <div className='bg-gray-50 p-3 rounded-lg'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
        <div className='flex items-center'>
          <SearchOutlined className='text-blue-500 mr-2' />
          <span className='font-medium text-gray-600'>Cluster:</span>
          <Tooltip title={`Cluster status: ${elasticsearch?.status ?? 'Unknown'}`}>
            <Tag color={getEsStatusColor(elasticsearch?.status)} className='ml-2'>
              {elasticsearch?.status ?? 'Unknown'}
            </Tag>
          </Tooltip>
        </div>
        {typeof elasticsearch?.nodeCount !== 'undefined' && (
          <div>
            <span className='font-medium text-gray-600'>Nodes:</span>
            <Tooltip title={`Number of nodes in the Elasticsearch cluster`}>
              <span className='ml-2'>{elasticsearch.nodeCount}</span>
            </Tooltip>
          </div>
        )}
        {typeof elasticsearch?.indexCount !== 'undefined' && (
          <div>
            <span className='font-medium text-gray-600'>Indices:</span>
            <Tooltip title={`Total number of indices in the cluster`}>
              <span className='ml-2'>{elasticsearch.indexCount}</span>
            </Tooltip>
          </div>
        )}
        {typeof elasticsearch?.docsCount !== 'undefined' && (
          <div>
            <span className='font-medium text-gray-600'>Documents:</span>
            <Tooltip title={`Total number of documents across all indices`}>
              <span className='ml-2'>{elasticsearch.docsCount}</span>
            </Tooltip>
          </div>
        )}
        {elasticsearch?.heap && (
          <div className='md:col-span-2'>
            <span className='font-medium text-gray-600'>Heap:</span>
            <Tooltip title={`JVM heap memory usage across the cluster`}>
              <span className='ml-2'>
                {formatBytes(elasticsearch.heap.used || 0)} /{' '}
                {formatBytes(elasticsearch.heap.max || 1)}
              </span>
            </Tooltip>
            <Progress
              percent={
                elasticsearch.heap.max
                  ? Math.min(
                      100,
                      (Number(elasticsearch.heap.used || 0) / Number(elasticsearch.heap.max)) * 100
                    )
                  : 0
              }
              showInfo={false}
              size='small'
              className='mt-2'
            />
          </div>
        )}
      </div>
    </div>
  </div>
);

export function SystemMetricsCard({
  systemMetrics,
  isLoading,
}: SystemMetricsCardProps) {
  const memoryUsage = systemMetrics?.system || {};
  const usedMemory = memoryUsage.totalMemory || 0;
  const totalMemory = memoryUsage.maxMemory || 1;
  const uptime = memoryUsage.uptime || 0;

  return (
    <Card
      title={
        <Space>
          <DashboardOutlined className='text-blue-500' />
          <span>System Metrics</span>
        </Space>
      }
      className='admin-card'
      loading={isLoading}
    >
      <Row gutter={[16, 16]}>
        {renderMemoryUsage(usedMemory, totalMemory)}

        <Col xs={24} sm={12} md={8}>
          <Statistic
            title='Uptime'
            value={formatUptime(uptime)}
            valueStyle={{ color: '#1890ff' }}
            prefix={<ClockCircleOutlined />}
          />
        </Col>

        <Col xs={24} sm={24} md={8}>
          <Statistic
            title='Environment'
            value={systemMetrics?.environment?.nodeEnv || 'Unknown'}
            valueStyle={{ color: '#722ed1' }}
            prefix={<DatabaseOutlined />}
            suffix={
              <Tag color='blue' className='ml-2'>
                {systemMetrics?.environment?.port || 'N/A'}
              </Tag>
            }
          />
        </Col>
      </Row>

      {systemMetrics?.database && renderDatabaseInfo(systemMetrics.database)}
      {systemMetrics?.supabase && renderSupabaseInfo(systemMetrics.supabase)}
      {systemMetrics?.elasticsearch && renderElasticsearchInfo(systemMetrics.elasticsearch)}
      {systemMetrics?.timestamp && (
        <div className='mt-4 text-center text-sm text-gray-500'>
          <Tooltip title={new Date(systemMetrics.timestamp).toLocaleString()}>
            <span>
              Last updated:{' '}
              {`${Math.floor((Date.now() - new Date(systemMetrics.timestamp).getTime()) / 1000)}s ago`}
            </span>
          </Tooltip>
        </div>
      )}
    </Card>
  );
}
