import React from 'react';
import Layout from '../Layout/Layout';
import PageHeader from '../PageHeader/PageHeader';
import styles from './PageLayout.module.css';

export type PageLayoutProps = {
  title: string;
  children: React.ReactNode;
};

const PageLayout = ({ title, children }: PageLayoutProps) => (
  <div className={styles.pageLayout} data-testid="PageLayout">
    <Layout>
      <div className="container">
        <div className={styles.header}>
          <PageHeader>{title}</PageHeader>
        </div>
        <div className={styles.main}>{children}</div>
      </div>
    </Layout>
  </div>
);

export default PageLayout;