import { useCallback, useState } from 'react';

/**
 * Pagination state interface
 */
export interface PaginationState {
  currentPage: number;
  pageSize: number;
}

/**
 * Sorting state interface
 */
export interface SortingState {
  sortBy: string;
  sortOrder: 'ASC' | 'DESC' | 'asc' | 'desc';
}

/**
 * Table management hook return type
 */
export interface UseTableManagementReturn {
  // Pagination
  currentPage: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  
  // Sorting
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  setSortBy: (field: string) => void;
  setSortOrder: (order: 'ASC' | 'DESC') => void;
  
  // Selection
  selectedRowKeys: string[];
  setSelectedRowKeys: (keys: string[]) => void;
  clearSelection: () => void;
  
  // Table change handler (for Ant Design Table)
  handleTableChange: (pagination: any, filters: any, sorter: any) => void;
  
  // Reset
  resetTable: () => void;
}

/**
 * Configuration options for table management
 */
export interface TableManagementConfig {
  initialPage?: number;
  initialPageSize?: number;
  initialSortBy?: string;
  initialSortOrder?: 'ASC' | 'DESC';
}

/**
 * Reusable hook for managing table state (pagination, sorting, row selection)
 * 
 * @param config - Configuration options
 * @returns Table management state and handlers
 * 
 * @example
 * ```tsx
 * const table = useTableManagement({
 *   initialSortBy: 'createdAt',
 *   initialSortOrder: 'DESC',
 * });
 * 
 * <Table
 *   onChange={table.handleTableChange}
 *   pagination={{
 *     current: table.currentPage,
 *     pageSize: table.pageSize,
 *   }}
 *   rowSelection={{
 *     selectedRowKeys: table.selectedRowKeys,
 *     onChange: table.setSelectedRowKeys,
 *   }}
 * />
 * ```
 */
export function useTableManagement(config: TableManagementConfig = {}): UseTableManagementReturn {
  const {
    initialPage = 1,
    initialPageSize = 10,
    initialSortBy = 'createdAt',
    initialSortOrder = 'DESC',
  } = config;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Sorting state
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>(initialSortOrder);

  // Selection state
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  /**
   * Handle Ant Design Table onChange event
   * Updates pagination and sorting state
   */
  const handleTableChange = useCallback(
    (pagination: any, _filters: any, sorter: any) => {
      // Update pagination
      if (pagination.current !== currentPage) {
        setCurrentPage(pagination.current);
      }
      if (pagination.pageSize !== pageSize) {
        setPageSize(pagination.pageSize);
        setCurrentPage(1); // Reset to first page when page size changes
      }

      // Update sorting
      if (sorter.field && (sorter.field !== sortBy || sorter.order !== sortOrder)) {
        setSortBy(sorter.field);
        // Convert Ant Design sort order to our format
        setSortOrder(sorter.order === 'ascend' ? 'ASC' : 'DESC');
      }
    },
    [currentPage, pageSize, sortBy, sortOrder]
  );

  /**
   * Clear row selection
   */
  const clearSelection = useCallback(() => {
    setSelectedRowKeys([]);
  }, []);

  /**
   * Reset all table state to initial values
   */
  const resetTable = useCallback(() => {
    setCurrentPage(initialPage);
    setPageSize(initialPageSize);
    setSortBy(initialSortBy);
    setSortOrder(initialSortOrder);
    setSelectedRowKeys([]);
  }, [initialPage, initialPageSize, initialSortBy, initialSortOrder]);

  return {
    // Pagination
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,

    // Sorting
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,

    // Selection
    selectedRowKeys,
    setSelectedRowKeys,
    clearSelection,

    // Handlers
    handleTableChange,
    resetTable,
  };
}
