import Button from '@/components/site/Button/Button';
import Modal from '@/components/site/Modal/Modal';
import React from 'react';

type ModalPlansMedicoProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan?: (planName: string, price: string) => void;
};

const plans = [
  {
    name: 'Plano Essencial',
    price: 'R$ 989,00/mês',
    features: [
      'Acesso ilimitado à base de médicos',
      'Filtros avançados de busca',
      'Contato direto via plataforma',
      'Suporte básico',
    ],
  },
  {
    name: 'Plano Profissional',
    price: 'R$ 1.890,00/mês',
    features: [
      'Todas as funcionalidades do Essencial',
      'Consultor dedicado',
      'Dashboard personalizado',
      'Relatórios mensais',
      'Suporte prioritário',
    ],
  },
  {
    name: 'Plano Corporativo',
    price: 'Sob consulta',
    features: [
      'Todas as funcionalidades do Profissional',
      'Integração com sistemas internos',
      'Treinamento in company',
      'Implantação personalizada',
      'Condições exclusivas para grandes volumes',
    ],
  },
];

export const ModalPlansMedico: React.FC<ModalPlansMedicoProps> = ({
  isOpen,
  onClose,
  onSelectPlan,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Planos Plataforma"
      classNameContent="max-w-[1200px] p-0"
    >
      <div id="planos_medicos" className="text-center">
        <p className="text-center mb-8 text-secondary text-base">
          Selecione o plano que melhor se adapta às suas necessidades de busca
          por profissionais médicos. Todos os planos incluem acesso completo aos
          filtros e à nossa base de dados qualificada.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-4">
          {plans.map(plan => (
            <div
              key={plan.name}
              className="bg-white rounded-2xl p-8 shadow-sm flex flex-col items-center text-center border border-gray-200 transition-shadow duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="text-primary text-xl font-bold mb-2">
                {plan.name}
              </h3>
              <p className="text-2xl font-bold text-primary mb-2">
                {plan.price}
              </p>
              <ul className="mb-6 text-left list-disc pl-5">
                {plan.features.map((feature, idx) => (
                  <li className="text-base text-secondary mb-1" key={idx}>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                variant="primary"
                fullWidth
                size="large"
                onClick={() =>
                  onSelectPlan && onSelectPlan(plan.name, plan.price)
                }
                className="mt-auto"
                disabled={plan.price === 'Sob consulta'}
              >
                {plan.price === 'Sob consulta'
                  ? 'Entre em contato'
                  : 'Selecionar'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
