import { QuadroKanbanView } from '@/components/kanban/QuadroKanbanView';
import { useRouter } from 'next/router';

export default function QuadroKanbanPage() {
  const router = useRouter();
  const { espacoId, quadroId } = router.query;

  if (!espacoId || typeof espacoId !== 'string' || !quadroId || typeof quadroId !== 'string') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">IDs inválidos</div>
      </div>
    );
  }

  return <QuadroKanbanView quadroId={quadroId} />;
}
