// src/components/utils/Tabs.tsx
import React from 'react';

type TabsProps = {
  tabs: string[];
  currentTab: string;
  classNameContainer?: string;
  classNameTabs?: string;
  classNameContent?: string;
  children: React.ReactNode;
  onTabChange?: (tab: string) => void; // opcional para controle externo
};

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  currentTab,
  classNameContainer = '',
  classNameTabs = '',
  classNameContent = '',
  children,
  onTabChange,
}) => {
  const activeIndex = Math.max(0, tabs.indexOf(currentTab));
  const childrenArray = React.Children.toArray(children);
  const content = childrenArray[activeIndex] ?? childrenArray[0] ?? null;

  return (
    <div className={classNameContainer}>
      <div className={classNameTabs}>
        <div className="flex flex-wrap gap-2 border-b border-gray-200">
          {tabs.map(tab => {
            const isActive = tab === currentTab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => onTabChange && onTabChange(tab)}
                className={`px-4 py-2 rounded-t-md transition-colors text-sm font-semibold ${
                  isActive
                    ? 'bg-white text-purple-700 border border-b-0 border-gray-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-selected={isActive}
                role="tab"
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>
      <div className={classNameContent} role="tabpanel">
        {content}
      </div>
    </div>
  );
};

export default Tabs;
