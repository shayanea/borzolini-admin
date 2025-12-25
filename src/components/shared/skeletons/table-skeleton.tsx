import { Skeleton } from 'antd';
import React from 'react';

interface TableSkeletonProps {
	rowCount?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ rowCount = 5 }) => {
	return (
		<div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-6">
			{/* Header-like skeleton */}
			<div className="flex gap-4 mb-6 border-b border-gray-100 pb-4">
				{[1, 2, 3, 4, 5].map((i) => (
					<Skeleton.Button key={i} active size="small" style={{ width: 100 + Math.random() * 50 }} className="opacity-50" />
				))}
			</div>

			{/* Rows */}
			{Array.from({ length: rowCount }).map((_, index) => (
				<div key={index} className="flex gap-4 mb-4 items-center">
					{/* Avatar column simulation or just first col */}
					<Skeleton.Avatar active size="small" shape="circle" />
					<Skeleton active title={false} paragraph={{ rows: 1, width: '90%' }} className="w-full" />
				</div>
			))}
		</div>
	);
};
