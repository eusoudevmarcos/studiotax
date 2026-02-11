import { PrimaryButton } from '@/components/button/PrimaryButton';
import ClienteForm from '@/components/form/ClienteForm';
import { PlusIcon } from '@/components/icons';
import ClienteList from '@/components/list/ClienteList';
import Modal from '@/components/modal/Modal';
import { useState } from 'react';

export default function Clientes() {
  const [showClientForm, setShowClientForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <div className="flex flex-row-reverse items-center w-full justify-between mb-2">
        <PrimaryButton onClick={() => setShowClientForm(true)}>
          <PlusIcon />
          Cadastrar Cliente
        </PrimaryButton>

        <h2 className="text-2xl font-bold text-primary">Lista de Clientes</h2>
      </div>

      <ClienteList key={refreshKey} />

      <Modal
        title="Cadastrar Cliente"
        isOpen={showClientForm}
        onClose={() => setShowClientForm(false)}
      >
        <ClienteForm
          onSuccess={() => {
            setShowClientForm(false);
            setRefreshKey(prev => prev + 1);
          }}
        />
      </Modal>
    </>
  );
}
