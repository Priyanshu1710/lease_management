import React from 'react';
import styles from './common.module.scss';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular';
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '16px',
  variant = 'text',
  className = ''
}) => {
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius: variant === 'circular' ? '50%' : variant === 'text' ? '4px' : '8px'
  };

  return <div className={`${styles.skeleton} ${className}`} style={style} />;
};

export const CardSkeleton: React.FC = () => {
  return (
    <div style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: '16px', backgroundColor: 'var(--bg-card)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Skeleton width="40%" height="24px" />
      <Skeleton width="100%" height="80px" variant="rectangular" />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Skeleton width="30%" height="16px" />
        <Skeleton width="20%" height="16px" />
      </div>
    </div>
  );
};
export default Skeleton;
