import { Card, Col, Row, Skeleton } from 'antd';
import React from 'react';

export const FormSkeleton: React.FC = () => {
	return (
		<div className="space-y-6">
			{/* Header Area */}
			<div className="flex justify-between items-center mb-6">
				<div className="flex items-center gap-4">
					<Skeleton.Button active size="default" shape="circle" />
					<div>
						<Skeleton.Input active size="small" style={{ width: 200, marginBottom: 8 }} />
						<Skeleton.Input active size="small" style={{ width: 300 }} block={false} />
					</div>
				</div>
				<div className="flex gap-2">
					<Skeleton.Button active size="default" style={{ width: 80 }} />
					<Skeleton.Button active size="default" style={{ width: 80 }} />
				</div>
			</div>

			<Card className="admin-card">
				<Skeleton active title={{ width: 150 }} paragraph={{ rows: 0 }} className="mb-8" />
				<Row gutter={24}>
					<Col span={12}>
						<div className="mb-6"><Skeleton active title={{ width: 100 }} paragraph={{ rows: 1 }} /></div>
						<div className="mb-6"><Skeleton active title={{ width: 100 }} paragraph={{ rows: 1 }} /></div>
						<div className="mb-6"><Skeleton active title={{ width: 100 }} paragraph={{ rows: 1 }} /></div>
					</Col>
					<Col span={12}>
						<div className="mb-6"><Skeleton active title={{ width: 100 }} paragraph={{ rows: 1 }} /></div>
						<div className="mb-6"><Skeleton active title={{ width: 100 }} paragraph={{ rows: 1 }} /></div>
						<div className="mb-6"><Skeleton active title={{ width: 100 }} paragraph={{ rows: 1 }} /></div>
					</Col>
				</Row>
			</Card>
		</div>
	);
};
