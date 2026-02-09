import { EspacoTrabalhoList } from '@/components/kanban/EspacoTrabalhoList';
import { EspacoTrabalhoProvider } from '@/context/EspacoTrabalhoContext';

export default function KanbanPage() {
  return (
    <EspacoTrabalhoProvider>
      <EspacoTrabalhoList />
    </EspacoTrabalhoProvider>
  );
}
