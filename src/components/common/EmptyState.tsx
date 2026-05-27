import React from 'react';
import styles from './common.module.scss';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records found',
  description = 'There are no items matching the current filters or query.',
  icon = <Inbox size={48} />,
  action,
  className = ''
}) => {
  return (
    <div className={`${styles.emptyState} ${className}`}>
      <div className={styles.emptyIcon}>{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action && <div style={{ display: 'inline-flex' }}>{action}</div>}
    </div>
  );
};
export default EmptyState;
