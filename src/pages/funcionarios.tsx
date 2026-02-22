import { PrimaryButton } from '@/components/button/PrimaryButton';
import { FuncionarioForm } from '@/components/form/FuncionarioForm';
import { PlusIcon } from '@/components/icons';
import FuncionariosList from '@/components/list/FuncionariosList';
import Modal from '@/components/modal/Modal';
import { useState } from 'react';

export default function Funcionarios() {
  const [showFuncionarioForm, setShowFuncionarioForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <FuncionariosList key={refreshKey} />

      <PrimaryButton
        className="float-right mt-4"
        onClick={() => setShowFuncionarioForm(true)}
      >
        <PlusIcon />
        Cadastrar Funcionario
      </PrimaryButton>

      <Modal
        isOpen={showFuncionarioForm}
        onClose={() => setShowFuncionarioForm(false)}
        title="Cadastro de Usuario do Sistema"
      >
        <FuncionarioForm
          onSuccess={() => {
            setRefreshKey(prev => prev + 1); // força re-render do ClientList
            setShowFuncionarioForm(false);
          }}
        />
      </Modal>
    </>
  );
}
