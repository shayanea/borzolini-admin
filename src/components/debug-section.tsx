import { Button } from 'antd';

interface DebugSectionProps {
  loading: boolean;
  error: string | null;
  stats: any;
  filters: any;
  chartsLoading: boolean;
  chartsError: string | null;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export const DebugSection = ({
  loading,
  error,
  stats,
  filters,
  chartsLoading,
  chartsError,
  isRefreshing,
  onRefresh,
}: DebugSectionProps) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-yellow-800 mb-2">Debug Information</h3>
      <div className="space-y-2 text-sm">
        <div><strong>Loading:</strong> {loading ? 'true' : 'false'}</div>
        <div><strong>Error:</strong> {error || 'none'}</div>
        <div><strong>Stats:</strong> {stats ? JSON.stringify(stats, null, 2) : 'null'}</div>
        <div><strong>Filters:</strong> {JSON.stringify(filters)}</div>
        <div><strong>Charts Loading:</strong> {chartsLoading ? 'true' : 'false'}</div>
        <div><strong>Charts Error:</strong> {chartsError || 'none'}</div>
        <div><strong>Is Refreshing:</strong> {isRefreshing ? 'true' : 'false'}</div>
      </div>
      <div className="mt-4 space-x-2">
        <Button onClick={onRefresh} loading={isRefreshing}>
          Manual Refresh
        </Button>
        <Button onClick={() => console.log('Current state:', { loading, error, stats, filters })}>
          Log to Console
        </Button>
      </div>
    </div>
  );
};
