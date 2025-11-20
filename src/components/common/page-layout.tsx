import { Layout } from 'antd';
import React from 'react';

const { Content } = Layout;

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

function PageLayout({
  children,
  className = 'min-h-screen',
  contentClassName = 'p-6',
}: PageLayoutProps) {
  return (
    <Layout className={className}>
      <Content className={contentClassName}>
        <div className='max-w-7xl mx-auto space-y-8'>{children}</div>
      </Content>
    </Layout>
  );
}

export { PageLayout };
export default PageLayout;
