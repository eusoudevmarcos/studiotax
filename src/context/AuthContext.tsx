/* eslint-disable @typescript-eslint/no-explicit-any */
import { TipoUsuario, TipoUsuarioEnum } from '@/schemas/funcionario.schema';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ZodUUID } from 'zod';

interface PlanoInfo {
  id: string;
  nome: string;
  tipo: string;
  limiteUso?: number;
  usosDisponiveis?: number;
  usosConsumidos?: number;
  status: string;
}

interface User {
  uid: ZodUUID;
  email: string;
  tipo: TipoUsuario;
  nome: string;
  cpf: string;
  razaoSocial?: string;
  planos?: PlanoInfo[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  // Funções para gerenciar planos e uso
  getUsosDisponiveis: () => number;
  temPlanoComUso: () => boolean;
  podeConsultarProfissionais: () => boolean;
  debitarUso: () => Promise<boolean>;
  refreshPlanos: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/getUser')
      .then(res => res.json())
      .then((data: { user?: User; error?: any }) => {
        if (data.user) setUser(data.user);
        else setUser(null);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // Função para obter total de usos disponíveis
  const getUsosDisponiveis = (): number => {
    if (!user?.planos) return 0;

    return user.planos.reduce((total, plano) => {
      if (plano.limiteUso && plano.usosDisponiveis !== undefined) {
        return total + plano.usosDisponiveis;
      }
      return total;
    }, 0);
  };

  // Verifica se tem plano com limite de uso
  const temPlanoComUso = (): boolean => {
    if (!user?.planos) return false;

    return user.planos.some(
      plano => plano.limiteUso && plano.status === 'ATIVA'
    );
  };

  // Verifica se pode consultar profissionais
  const podeConsultarProfissionais = (): boolean => {
    if (!user || user.tipo !== 'CLIENTE') return false;

    // Se não tem plano com uso, não pode consultar
    if (!temPlanoComUso()) return false;

    // Se tem usos disponíveis, pode consultar
    return getUsosDisponiveis() > 0;
  };

  // Debita um uso do plano
  const debitarUso = async (): Promise<boolean> => {
    try {
      const response = await fetch(
        '/api/externalWithAuth/billing/debitar-uso',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        // Atualiza os planos do usuário
        await refreshPlanos();
        return true;
      }
      return false;
    } catch (error) {
      console.log('Erro ao debitar uso:', error);
      return false;
    }
  };

  // Atualiza os planos do usuário
  const refreshPlanos = async (): Promise<void> => {
    try {
      const response = await fetch(
        '/api/externalWithAuth/planos/planos-usuario'
      );
      if (response.ok) {
        const data = await response.json();
        if (user) {
          setUser({
            ...user,
            planos: data.planos || [],
          });
        }
      }
    } catch (error) {
      console.log('Erro ao atualizar planos:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
        getUsosDisponiveis,
        temPlanoComUso,
        podeConsultarProfissionais,
        debitarUso,
        refreshPlanos,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return ctx;
}

export function useUser(): User | null {
  const { user } = useAuth();
  return user;
}

export function useAdmin(): boolean | null {
  const { user } = useAuth();
  return user?.tipo === TipoUsuarioEnum.enum.ADMIN_SISTEMA;
}

export function useCliente(): boolean {
  const { user } = useAuth();
  return user?.tipo !== TipoUsuarioEnum.enum.CLIENTE;
}

export const onLogout = () => {
  fetch('/api/logout', { method: 'POST' }).then(() => {
    location.reload();
  });
};

// Hook para gerenciar planos
export function usePlano() {
  const {
    user,
    getUsosDisponiveis,
    temPlanoComUso,
    podeConsultarProfissionais,
    debitarUso,
    refreshPlanos,
  } = useAuth();

  return {
    planos: user?.planos || [],
    usosDisponiveis: getUsosDisponiveis(),
    temPlanoComUso: temPlanoComUso(),
    podeConsultarProfissionais: podeConsultarProfissionais(),
    debitarUso,
    refreshPlanos,
  };
}
