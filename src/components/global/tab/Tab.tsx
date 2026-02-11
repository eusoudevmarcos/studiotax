/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

interface Tab {
  label: string;
  value: string;
  disabled?: boolean;
}

interface TabProps {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  tabClassName?: string;
  children?: React.ReactNode;
  tabsOptions?: Record<string, any>;
}

export const Tab: React.FC<TabProps> = ({
  tabs,
  tabsOptions,
  value,
  onChange,
  className = '',
  tabClassName = '',
  children,
}) => {
  return (
    <div className={`${className}`}>
      <div className="flex border-2 border-gray-200 gap-2 p-1 ">
        {tabs.map(tab => (
          <button
            type="button"
            key={tab.value}
            onClick={() => !tab.disabled && onChange(tab.value)}
            className={`
              px-4 py-2 
              text-sm font-medium
              focus:outline-none 
              border-b-2 
              transition-all   
              rounded-md
              text-black
              ${
                tab.disabled
                  ? 'text-gray-400 cursor-not-allowed border-b-2 border-transparent'
                  : value === tab.value
                  ? 'text-black bg-primary'
                  : 'bg-secondary opacity-80 border-transparent text-gray-500 hover:text-primary'
              }
              ${tabClassName}
            `}
            disabled={tab.disabled}
          >
            {tab.label}
            {tabsOptions &&
              tabsOptions[tab.value] &&
              tabsOptions[tab.value]['_count'] !== undefined && (
                <span className="ml-2">
                  ({tabsOptions[tab.value]['_count']})
                </span>
              )}
          </button>
        ))}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
};
