import Card from '@/components/Card';
import Modal from './Modal';

interface ModalPlanoClienteProps {
  isOpen: boolean;
  onClose: () => void;
  planos: Array<{
    id: string;
    status: string;
    dataAssinatura: string;
    dataExpiracao?: string;
    usosDisponiveis?: number;
    plano: {
      nome: string;
      tipo: string;
      descricao?: string;
      limiteUso?: number;
      diasGarantia?: number;
      categoria: string;
    };
  }>;
}

export function ModalPlanoCliente({
  isOpen,
  onClose,
  planos,
}: ModalPlanoClienteProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="PLANOS DO CLIENTE">
      <div className="grid md:grid-cols-1 gap-4">
        {planos.map(planoAssinatura => (
          <Card
            key={planoAssinatura.id}
            title={{
              label: planoAssinatura.plano.nome,
              className: 'text-lg text-center w-full',
            }}
            classNameContainer="shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex gap-2 items-center">
                <span className="font-medium">Categoria:</span>
                <span className="text-secondary">
                  {planoAssinatura.plano.categoria.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="flex gap-2 items-center">
                <span className="font-medium">Tipo:</span>
                <span className="text-secondary">
                  {planoAssinatura.plano.tipo.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="flex gap-2 items-center">
                <span className="font-medium">Status:</span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    planoAssinatura.status === 'ATIVA'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {planoAssinatura.status}
                </span>
              </div>

              <div className="flex gap-2 items-center">
                <span className="font-medium">Assinatura:</span>
                <span className="text-secondary">
                  {planoAssinatura.dataAssinatura}
                </span>
              </div>

              {planoAssinatura.dataExpiracao && (
                <div className="flex gap-2 items-center">
                  <span className="font-medium">Expira:</span>
                  <span className="text-secondary">
                    {planoAssinatura.dataExpiracao}
                  </span>
                </div>
              )}

              {planoAssinatura.plano.descricao && (
                <div className="mt-3">
                  <span className="font-medium">Descrição:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    {planoAssinatura.plano.descricao}
                  </p>
                </div>
              )}

              {planoAssinatura.plano.limiteUso && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Limite de uso:</span>
                  <span className="text-secondary">
                    {planoAssinatura.usosDisponiveis ||
                      planoAssinatura.plano.limiteUso}{' '}
                    usos
                  </span>
                </div>
              )}

              {planoAssinatura.plano.diasGarantia && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Garantia:</span>
                  <span className="text-secondary">
                    {planoAssinatura.plano.diasGarantia} dias
                  </span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </Modal>
  );
}
