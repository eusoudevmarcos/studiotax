import React from 'react';

// Skeleton Loader for Table - Desktop
export const TableLoadingSkeleton: React.FC<{
  columns: number;
  rows?: number;
}> = ({ columns, rows = 5 }) => {
  return (
    <div className="hidden md:block overflow-x-auto w-full">
      <table className="min-w-full border-separate border border-gray-300 border-spacing-0 bg-white rounded-lg">
        <thead>
          <tr>
            {[...Array(columns)].map((_, idx) => (
              <th
                key={idx}
                className="px-4 py-5 bg-neutral"
                style={{ position: 'sticky', top: 0, zIndex: 1 }}
              >
                <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(rows)].map((_row, rIdx) => (
            <tr key={rIdx}>
              {[...Array(columns)].map((_td, cIdx) => (
                <td key={cIdx} className="px-4 py-5 border-b border-gray-300">
                  <div className="h-4 w-full rounded bg-gray-100 animate-pulse" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Skeleton Loader for Table - Mobile
export const TableMobileLoadingSkeleton: React.FC<{
  columns: string[];
  rows?: number;
}> = ({ columns, rows = 5 }) => {
  return (
    <div className="md:hidden">
      {[...Array(rows)].map((_, idx) => (
        <div
          key={idx}
          className="bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm"
        >
          {columns.map((label, cIdx) => (
            <div
              key={label}
              className={`flex justify-between items-start gap-2 ${
                cIdx !== columns.length - 1 ? 'mb-3' : ''
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-gray-300 mb-1 h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
                <div className="text-sm text-gray-200 words h-4 w-24 bg-gray-100 animate-pulse rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableLoadingSkeleton;
