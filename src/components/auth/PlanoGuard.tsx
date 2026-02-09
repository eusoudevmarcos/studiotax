// frontend/src/components/auth/PlanoGuard.tsx
import { usePlano } from '@/context/AuthContext';
import React from 'react';

interface PlanoGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredPlano?: string;
  requireUso?: boolean;
}

const PlanoGuard: React.FC<PlanoGuardProps> = ({
  children,
  fallback,
  requiredPlano,
  requireUso = false,
}) => {
  const { planos, podeConsultarProfissionais, usosDisponiveis } = usePlano();

  // Se não tem planos, não pode acessar
  if (planos.length === 0) {
    return (
      fallback || (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
          <div className="text-center">
            <span className="material-icons-outlined text-6xl text-gray-400 mb-4">
              credit_card_off
            </span>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhum plano ativo
            </h3>
            <p className="text-gray-500 mb-4">
              Você precisa de um plano ativo para acessar esta funcionalidade.
            </p>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
              Ver Planos
            </button>
          </div>
        </div>
      )
    );
  }

  // Se requer uso específico e não pode consultar profissionais
  if (requireUso && !podeConsultarProfissionais) {
    return (
      fallback || (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
          <div className="text-center">
            <span className="material-icons-outlined text-6xl text-orange-400 mb-4">
              warning
            </span>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Usos esgotados
            </h3>
            <p className="text-gray-500 mb-4">
              Você não possui mais usos disponíveis. Adquira um novo plano para
              continuar.
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                Ver Planos
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Histórico de Uso
              </button>
            </div>
          </div>
        </div>
      )
    );
  }

  // Se requer plano específico
  if (requiredPlano) {
    const temPlanoRequerido = planos.some(
      plano =>
        plano.nome.toLowerCase().includes(requiredPlano.toLowerCase()) &&
        plano.status === 'ATIVA'
    );

    if (!temPlanoRequerido) {
      return (
        fallback || (
          <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
            <div className="text-center">
              <span className="material-icons-outlined text-6xl text-blue-400 mb-4">
                upgrade
              </span>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Plano insuficiente
              </h3>
              <p className="text-gray-500 mb-4">
                Esta funcionalidade requer o plano {requiredPlano}. Faça upgrade
                do seu plano.
              </p>
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                Fazer Upgrade
              </button>
            </div>
          </div>
        )
      );
    }
  }

  // Se chegou até aqui, pode acessar
  return <>{children}</>;
};

export default PlanoGuard;
