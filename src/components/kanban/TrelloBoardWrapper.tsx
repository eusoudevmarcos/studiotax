import React from 'react';

interface LaneCard {
  id: string;
  title: string;
  [key: string]: unknown;
}

interface Lane {
  id: string;
  title: string;
  cards?: LaneCard[];
}

interface TrelloBoardWrapperProps {
  data: {
    lanes: Lane[];
    total?: number;
    page?: number;
    pageSize?: number;
    totalPages?: number;
  };
  style?: React.CSSProperties;
  laneStyle?: React.CSSProperties;
  onCardMoveAcrossLanes?: (
    cardId: string,
    sourceLaneId: string,
    targetLaneId: string
  ) => void;
  components?: {
    Card?: React.ComponentType<{ data: LaneCard }>;
  };
}

// Componente stub - precisa ser implementado com react-trello ou substituído
export const TrelloBoardWrapper: React.FC<TrelloBoardWrapperProps> = ({
  data,
  style,
  laneStyle,
  components,
}) => {
  // TODO: Implementar com react-trello Board ou substituir por componente customizado
  console.warn('TrelloBoardWrapper: Componente não implementado. Usando stub.');

  return (
    <div style={style}>
      {data.lanes.map((lane: Lane) => (
        <div key={lane.id} style={laneStyle}>
          <h3>{lane.title}</h3>
          {lane.cards?.map((card: LaneCard) => {
            const CardComponent =
              components?.Card || (() => <div>{card.title}</div>);
            return <CardComponent key={card.id} data={card} />;
          })}
        </div>
      ))}
    </div>
  );
};
