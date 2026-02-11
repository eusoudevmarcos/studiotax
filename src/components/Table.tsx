/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import ButtonCopy from './button/ButtonCopy';
import TableLoadingSkeleton, {
  TableMobileLoadingSkeleton,
} from './global/loading/LoadingTable';

export interface TableColumn<T = any> {
  label: string;
  key: keyof T | string;
  render?: (row: T, index: number) => React.ReactNode; // render completo por linha
  hiddeBtnCopy?: boolean;
}

interface PaginationProps {
  page: number;
  pageSize?: number;
  total: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

interface TableProps<T = any> {
  data: T[] | undefined;
  columns: TableColumn<T>[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  pagination?: PaginationProps;
}

function renderCellValue<T>(
  value: any,
  col: TableColumn<T>,
  row: T,
  index: number
): React.ReactNode {
  if (col.render) {
    return col.render(row, index);
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return '-';
    return value.join(', ');
  }

  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value);
  }

  return value !== undefined && value !== null && value !== ''
    ? String(value)
    : '-';
}

// Componente Card para Mobile

function MobileCard<T>({
  row,
  columns,
  onRowClick,
  index,
}: {
  row: T;
  columns: TableColumn<T>[];
  onRowClick?: (row: T) => void;
  index: number;
}) {
  const handleRowClick = () => {
    if (onRowClick) onRowClick(row);
  };

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition-all duration-200 ${
        onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''
      }`}
      onClick={handleRowClick}
    >
      {columns.map((col, colIndex) => {
        const content = col.render
          ? col.render(row, index)
          : (row as any)[col.key] ?? '-';
        return (
          <div
            key={String(col.key)}
            className={`flex justify-between items-start gap-2 ${
              colIndex !== columns.length - 1 ? 'mb-3' : ''
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-600 mb-1">
                {col.label}
              </div>
              <div className="text-sm text-gray-900 words">{content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Componente TR para Desktop
function TR<T>({
  row,
  columns,
  onRowClick,
  index,
}: {
  row: T;
  columns: TableColumn<T>[];
  onRowClick?: (row: T) => void;
  index: number;
}) {
  const [textFull, setTextFull] = useState(false);
  const handleRowClick = () => {
    if (onRowClick) onRowClick(row);
  };

  return (
    <tr
      className=""
      onClick={handleRowClick}
      style={{ cursor: onRowClick ? 'pointer' : 'default' }}
    >
      {columns.map(col => {
        const value = (row as any)[col.key];
        const content = col.render ? col.render(row, index) : value ?? '-';
        const hiddeBtnCopy = col.hiddeBtnCopy ?? false;
        return (
          <td
            key={String(col.key)}
            className="relative group max-w-[160px] min-w-[80px] align-middle px-4 py-3 border-b border-gray-300"
            style={{ verticalAlign: 'middle' }}
          >
            <div className="flex items-center gap-2 w-full">
              <p
                onMouseEnter={() => setTextFull(true)}
                onMouseLeave={() => setTextFull(false)}
                className={`${'whitespace-nowrap overflow-hidden text-ellipsis'} flex-1 mb-0`}
                title={content}
              >
                {content}
              </p>
              {!hiddeBtnCopy && (
                <ButtonCopy value={content} className="bg-white!" />
              )}
            </div>
          </td>
        );
      })}
    </tr>
  );
}

// Componente de paginação
const Pagination: React.FC<PaginationProps> = ({
  page,
  total,
  totalPages,
  onPageChange,
}) => {
  const getPages = () => {
    const pages = [];
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, page + 2);

    if (end - start < 4) {
      if (start === 1) {
        end = Math.min(totalPages, start + 4);
      } else if (end === totalPages) {
        start = Math.max(1, end - 4);
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex justify-between items-center gap-2 mt-4">
      <span className="text-primary text-sm text-center">
        {total} registros
      </span>
      <div className="flex items-center gap-2">
        <button
          className="px-1 py-0.5 rounded border text-primary border-primary disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed text-sm cursor-pointe flex hover:scale-105"
          onClick={() => onPageChange && onPageChange(page - 1)}
          disabled={page === 1}
        >
          <span className="material-icons-outlined">chevron_left</span>
        </button>
        {getPages().map(p => (
          <button
            key={p}
            className={`px-3 py-1 rounded border text-sm hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed ${
              p === page
                ? 'text-primary text-black border-primary cursor-pointer'
                : 'text-black border-gray-400 bg-white cursor-pointer'
            }`}
            onClick={() => onPageChange && onPageChange(p)}
            disabled={p === page}
          >
            {p}
          </button>
        ))}
        <button
          className="flex px-1 py-0.5 rounded border text-primary border-primary disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed text-sm cursor-pointer hover:scale-105"
          onClick={() => onPageChange && onPageChange(page + 1)}
          disabled={page === totalPages}
        >
          <span className="material-icons-outlined">chevron_right</span>
        </button>
      </div>
      <span className="text-primary text-sm text-center">
        Página {page} de {totalPages}
      </span>
    </div>
  );
};

// Componente Empty State para Desktop
const DesktopEmptyState = ({
  columns,
  emptyMessage,
}: {
  columns: TableColumn[];
  emptyMessage: string;
}) => (
  <tr>
    <td
      colSpan={columns.length}
      className="text-center py-6 text-secondary font-medium"
    >
      {emptyMessage}
    </td>
  </tr>
);

// Componente Empty State para Mobile
const MobileEmptyState = ({ emptyMessage }: { emptyMessage: string }) => (
  <div className="text-center py-12 text-secondary font-medium">
    {emptyMessage}
  </div>
);

function Table<T>({
  data,
  columns,
  loading = false,
  onRowClick,
  emptyMessage = 'Nenhum resultado encontrado.',
  pagination,
}: TableProps<T>) {
  if (loading) {
    return (
      <>
        <div className="hidden md:block overflow-x-auto w-full">
          <TableLoadingSkeleton columns={columns.length} />
        </div>
        <div className="md:hidden">
          <TableMobileLoadingSkeleton columns={columns.map(col => col.label)} />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="hidden md:block overflow-x-auto w-full">
        <table className="min-w-full border-separate border border-gray-300 border-spacing-0 bg-white rounded-lg">
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  className="px-4 py-3 text-left font-semibold bg-neutral text-primary"
                  style={{ position: 'sticky', top: 0, zIndex: 1 }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!data || data.length === 0 ? (
              <DesktopEmptyState
                columns={columns}
                emptyMessage={emptyMessage}
              />
            ) : (
              data.map((row, i) => (
                <TR
                  key={i}
                  row={row}
                  columns={columns}
                  onRowClick={onRowClick}
                  index={i}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden">
        {!data || data.length === 0 ? (
          <MobileEmptyState emptyMessage={emptyMessage} />
        ) : (
          <div className="space-y-0">
            {data.map((row, i) => (
              <MobileCard
                key={i}
                row={row}
                columns={columns}
                onRowClick={onRowClick}
                index={i}
              />
            ))}
          </div>
        )}
      </div>

      {pagination && (
        <Pagination
          page={pagination.page}
          pageSize={pagination.pageSize}
          total={pagination.total}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
        />
      )}
    </>
  );
}

export default Table;
