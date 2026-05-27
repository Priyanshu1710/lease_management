import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMockStore } from '../../hooks/useMockStore';
import { Search, X, Building2, Users2, FileText, CreditCard, Wrench, FolderOpen } from 'lucide-react';
import styles from './layout.module.scss';

export const GlobalSearchModal: React.FC = () => {
  const { globalSearchOpen, setGlobalSearchOpen, getGlobalSearchItems } = useMockStore();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (globalSearchOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [globalSearchOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setGlobalSearchOpen(false);
      }
    };

    if (globalSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [globalSearchOpen, setGlobalSearchOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setGlobalSearchOpen]);

  if (!globalSearchOpen) return null;

  const allItems = getGlobalSearchItems();
  const filteredItems = query.trim()
    ? allItems.filter(
        item =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          item.type.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleItemClick = (link: string) => {
    setGlobalSearchOpen(false);
    navigate(link);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'property': return <Building2 size={16} />;
      case 'tenant': return <Users2 size={16} />;
      case 'lease': return <FileText size={16} />;
      case 'invoice': return <CreditCard size={16} />;
      case 'ticket': return <Wrench size={16} />;
      case 'document': return <FolderOpen size={16} />;
      default: return <Search size={16} />;
    }
  };

  return (
    <div className={styles.searchModalOverlay}>
      <div ref={modalRef} className={styles.searchModal}>
        <div className={styles.searchInputWrapper}>
          <Search size={20} className="text-muted" />
          <input
            ref={inputRef}
            type="text"
            className={styles.searchField}
            placeholder="Search properties, tenants, leases, tickets, invoices..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={() => setGlobalSearchOpen(false)}>
            <X size={20} className="text-secondary" />
          </button>
        </div>
        <div className={styles.searchResults}>
          {query.trim() === '' ? (
            <div className={styles.noResults}>
              Type something to search...
            </div>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className={styles.searchItem}
                onClick={() => handleItemClick(item.link)}
              >
                <div className={styles.itemIcon}>{getIcon(item.type)}</div>
                <div className={styles.itemDetails}>
                  <div className={styles.itemTitle}>{item.title}</div>
                  <div className={styles.itemSub}>{item.subtitle}</div>
                </div>
                <div className={styles.itemBadge}>{item.type}</div>
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              No results found for "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default GlobalSearchModal;
