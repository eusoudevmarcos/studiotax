/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  atualizarEspacoTrabalho,
  atualizarQuadroKanban,
  criarEspacoTrabalho,
  criarQuadroKanban,
  deletarEspacoTrabalho,
  deletarQuadroKanban,
  listarEspacosTrabalho,
  obterEspacoTrabalhoPorId,
} from '@/axios/kanban.axios';
import { useDeleteAnimation } from '@/hooks/useDeleteAnimation';
import {
  EspacoTrabalho,
  EspacoTrabalhoComQuadros,
  EspacoTrabalhoInput,
  QuadroKanban,
  QuadroKanbanInput
} from '@/schemas/kanban.schema';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

interface EspacoTrabalhoContextType {
  // Estado
  espacosTrabalho: EspacoTrabalho[];
  espacoTrabalhoAtual: EspacoTrabalhoComQuadros | null;
  loading: boolean;
  error: string | null;

  // Ações de Espaço de Trabalho
  fetchEspacosTrabalho: () => Promise<void>;
  fetchEspacoTrabalho: (id: string) => Promise<void>;
  criarEspaco: (data: EspacoTrabalhoInput) => Promise<void>;
  atualizarEspaco: (id: string, data: EspacoTrabalhoInput) => Promise<void>;
  deletarEspaco: (id: string) => Promise<void>;

  // Ações de Quadro
  criarQuadro: (data: QuadroKanbanInput) => Promise<QuadroKanban>;
  atualizarQuadro: (id: string, data: QuadroKanbanInput) => Promise<void>;
  deletarQuadro: (id: string) => Promise<void>;

  // Delete Animation
  isItemAnimating: (itemId: string) => boolean;
  startDeleteAnimation: (
    itemId: string,
    onComplete: () => Promise<void>
  ) => void;
}

const EspacoTrabalhoContext = createContext<
  EspacoTrabalhoContextType | undefined
>(undefined);

interface EspacoTrabalhoProviderProps {
  children: React.ReactNode;
  espacoId?: string; // Opcional: se fornecido, carrega o espaço específico
}

export const EspacoTrabalhoProvider: React.FC<
  EspacoTrabalhoProviderProps
> = ({ children, espacoId }) => {
  const [espacosTrabalho, setEspacosTrabalho] = useState<
  EspacoTrabalho[]
  >([]);
  const [espacoTrabalhoAtual, setEspacoTrabalhoAtual] =
    useState<EspacoTrabalhoComQuadros | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const {
    isItemAnimating,
    startDeleteAnimation: startDeleteAnimationHook,
  } = useDeleteAnimation();

  // Fetch lista de espaços
  const fetchEspacosTrabalho = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const espacos = await listarEspacosTrabalho();
      console.log('Espaços de trabalho:', espacos);
      setEspacosTrabalho(espacos as EspacoTrabalho[]);
    } catch (err: any) {
      console.log('Erro ao buscar espaços de trabalho:', err);
      setError(err.message || 'Erro ao carregar espaços de trabalho');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch espaço específico
  const fetchEspacoTrabalho = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const espaco = await obterEspacoTrabalhoPorId(id);
      setEspacoTrabalhoAtual(espaco);
      // setEspacosTrabalho(prev =>
      //   prev.map(e => (e.id === id ? espaco : e))
      // );
    } catch (err: any) {
      console.log('Erro ao buscar espaço de trabalho:', err);
      setError(err.message || 'Erro ao carregar espaço de trabalho');
    } finally {
      setLoading(false);
    }
  }, []);

  // Criar espaço
  const criarEspaco = useCallback(
    async (data: EspacoTrabalhoInput) => {
      try {
        setLoading(true);
        setError(null);
        await criarEspacoTrabalho(data);
        await fetchEspacosTrabalho();
      } catch (err: any) {
        console.log('Erro ao criar espaço de trabalho:', err);
        setError(err.message || 'Erro ao criar espaço de trabalho');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchEspacosTrabalho]
  );

  // Atualizar espaço
  const atualizarEspaco = useCallback(
    async (id: string, data: EspacoTrabalhoInput) => {
      try {
        setLoading(true);
        setError(null);
        await atualizarEspacoTrabalho(id, data);
        await fetchEspacosTrabalho();
        // Se é o espaço atual, recarregar
        if (espacoTrabalhoAtual?.id === id) {
          await fetchEspacoTrabalho(id);
        }
      } catch (err: any) {
        console.log('Erro ao atualizar espaço de trabalho:', err);
        setError(err.message || 'Erro ao atualizar espaço de trabalho');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchEspacosTrabalho, fetchEspacoTrabalho, espacoTrabalhoAtual?.id]
  );

  // Deletar espaço com animação
  const deletarEspaco = useCallback(
    async (id: string) => {
      startDeleteAnimationHook(id, async () => {
        try {
          setLoading(true);
          setError(null);
          await deletarEspacoTrabalho(id);
          setEspacosTrabalho(prev => prev.filter(e => e.id !== id));
          if (espacoTrabalhoAtual?.id === id) {
            setEspacoTrabalhoAtual(null);
          }
        } catch (err: any) {
          console.log('Erro ao deletar espaço de trabalho:', err);
          setError(err.message || 'Erro ao deletar espaço de trabalho');
          throw err;
        } finally {
          setLoading(false);
        }
      });
    },
    [startDeleteAnimationHook, espacoTrabalhoAtual?.id]
  );

  // Criar quadro
  const criarQuadro = useCallback(
    async (data: QuadroKanbanInput): Promise<QuadroKanban> => {
      try {
        setLoading(true);
        setError(null);
        const novoQuadro = await criarQuadroKanban(data);
        // Recarregar espaço atual se for o mesmo
        if (espacoTrabalhoAtual?.id === data.espacoTrabalhoId) {
          await fetchEspacoTrabalho(data.espacoTrabalhoId);
        }
        // Atualizar lista também
        await fetchEspacosTrabalho();
        return novoQuadro;
      } catch (err: any) {
        console.log('Erro ao criar quadro:', err);
        setError(err.message || 'Erro ao criar quadro');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchEspacoTrabalho, fetchEspacosTrabalho, espacoTrabalhoAtual?.id]
  );

  // Atualizar quadro
  const atualizarQuadro = useCallback(
    async (id: string, data: QuadroKanbanInput) => {
      try {
        setLoading(true);
        setError(null);
        await atualizarQuadroKanban(id, data);
        // Recarregar espaço atual se necessário
        if (espacoTrabalhoAtual) {
          await fetchEspacoTrabalho(espacoTrabalhoAtual.id);
        }
        await fetchEspacosTrabalho();
      } catch (err: any) {
        console.log('Erro ao atualizar quadro:', err);
        setError(err.message || 'Erro ao atualizar quadro');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchEspacoTrabalho, fetchEspacosTrabalho, espacoTrabalhoAtual]
  );

  // Deletar quadro com animação
  const deletarQuadro = useCallback(
    async (id: string) => {
      startDeleteAnimationHook(id, async () => {
        try {
          setLoading(true);
          setError(null);
          await deletarQuadroKanban(id);
          // Recarregar espaço atual se necessário
          if (espacoTrabalhoAtual) {
            await fetchEspacoTrabalho(espacoTrabalhoAtual.id);
          }
          await fetchEspacosTrabalho();
        } catch (err: any) {
          console.log('Erro ao deletar quadro:', err);
          setError(err.message || 'Erro ao deletar quadro');
          throw err;
        } finally {
          setLoading(false);
        }
      });
    },
    [startDeleteAnimationHook, fetchEspacoTrabalho, fetchEspacosTrabalho, espacoTrabalhoAtual]
  );

  // Carregar espaço específico se espacoId for fornecido
  useEffect(() => {
    if (espacoId) {
      fetchEspacoTrabalho(espacoId);
    }
  }, [espacoId, fetchEspacoTrabalho]);

  // Carregar lista inicial se não houver espacoId
  useEffect(() => {
    if (!espacoId) {
      fetchEspacosTrabalho();
    }
  }, [espacoId, fetchEspacosTrabalho]);

  const value: EspacoTrabalhoContextType = {
    espacosTrabalho,
    espacoTrabalhoAtual,
    loading,
    error,
    fetchEspacosTrabalho,
    fetchEspacoTrabalho,
    criarEspaco,
    atualizarEspaco,
    deletarEspaco,
    criarQuadro,
    atualizarQuadro,
    deletarQuadro,
    isItemAnimating,
    startDeleteAnimation: startDeleteAnimationHook,
  };

  return (
    <EspacoTrabalhoContext.Provider value={value}>
      {children}
    </EspacoTrabalhoContext.Provider>
  );
};

export const useEspacoTrabalho = (): EspacoTrabalhoContextType => {
  const context = useContext(EspacoTrabalhoContext);
  if (context === undefined) {
    throw new Error(
      'useEspacoTrabalho must be used within a EspacoTrabalhoProvider'
    );
  }
  return context;
};
