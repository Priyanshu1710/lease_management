import React from 'react';
import styles from './common.module.scss';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'muted';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'muted',
  className = '',
  icon,
  style
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'success': return styles.badgeSuccess;
      case 'warning': return styles.badgeWarning;
      case 'danger': return styles.badgeDanger;
      case 'info': return styles.badgeInfo;
      case 'muted': return styles.badgeMuted;
      default: return styles.badgeMuted;
    }
  };

  return (
    <span className={`${styles.badge} ${getVariantClass()} ${className}`} style={style}>
      {icon && <span style={{ display: 'inline-flex', fontSize: '0.9em' }}>{icon}</span>}
      {children}
    </span>
  );
};
export default Badge;
