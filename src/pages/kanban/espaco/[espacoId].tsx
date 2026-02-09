import { EspacoTrabalhoDetail } from '@/components/kanban/EspacoTrabalhoDetail';
import { EspacoTrabalhoProvider } from '@/context/EspacoTrabalhoContext';
import { useRouter } from 'next/router';

export default function EspacoTrabalhoPage() {
  const router = useRouter();
  const { espacoId } = router.query;

  if (!espacoId || typeof espacoId !== 'string') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">ID do espaço de trabalho inválido</div>
      </div>
    );
  }

  return (
    <EspacoTrabalhoProvider espacoId={espacoId}>
      <EspacoTrabalhoDetail espacoId={espacoId} />
    </EspacoTrabalhoProvider>
  );
}
