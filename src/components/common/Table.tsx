import React from 'react';
import styles from './common.module.scss';
import Button from './Button';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

export const Table: React.FC<TableProps> = ({
  headers,
  children,
  currentPage,
  totalPages,
  onPageChange,
  className = ''
}) => {
  const showPagination = currentPage !== undefined && totalPages !== undefined && totalPages > 1;

  return (
    <div className={`${styles.tableContainer} ${className}`}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            {headers.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {children}
        </tbody>
      </table>
      {showPagination && onPageChange && (
        <div className={styles.tablePagination}>
          <span className={styles.paginationText}>
            Page {currentPage} of {totalPages}
          </span>
          <div className={styles.paginationBtns}>
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Table;
