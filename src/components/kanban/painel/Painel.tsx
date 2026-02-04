import React from "react";

export type popupPositionType = { top: number; left: number } | null;

interface PainelProps {
    popupPosition: popupPositionType;
    children: React.ReactNode;
    title: string;
    panelType?: string;
    minWidth?: string;
    maxWidth?: string;
}

export const Painel = ({
    popupPosition,
    title,
    children,
    panelType = 'panel',
    minWidth = '280px',
    maxWidth = '350px'
}: PainelProps) => {

    return (
        <div
            data-panel={panelType}
            className="absolute z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-md"
            style={{
                top: `${popupPosition?.top}px`,
                left: `${popupPosition?.left}px`,
                minWidth,
                maxWidth,
            }}
        >
            <h3 className="text-sm font-semibold text-gray-700 mb-1 text-center">{title}</h3>
            {children}
        </div>
    );
};