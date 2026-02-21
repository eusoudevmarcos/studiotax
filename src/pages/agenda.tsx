import { ConnectGoogleButton } from '@/components/button/GoogleAuth';
import { PrimaryButton } from '@/components/button/PrimaryButton';
import { AgendaForm } from '@/components/form/AgendaForm';
import { PlusIcon } from '@/components/icons';
import AgendaList from '@/components/list/AgendaList';
import Modal from '@/components/modal/Modal';
import { SessionProvider } from 'next-auth/react';
import { useState } from 'react';

export default function Agenda() {
  const [showAgendaForm, setShowAgendaForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <SessionProvider>
      <AgendaList key={refreshKey} />

      {/* <AdminGuard> */}
      <PrimaryButton
        className="float-right mt-4"
        onClick={() => setShowAgendaForm(true)}
      >
        <PlusIcon />
        Cadastrar Agendamento
      </PrimaryButton>
      <ConnectGoogleButton className="float-right mt-4 mr-2" />
      {/* </AdminGuard> */}

      <Modal
        title="Cadastrar Agendamento"
        isOpen={showAgendaForm}
        onClose={() => setShowAgendaForm(false)}
      >
        <AgendaForm
          onSuccess={() => {
            setShowAgendaForm(false);
            setRefreshKey(prev => prev + 1); // força re-render do AgendaList
          }}
        />
      </Modal>
    </SessionProvider>
  );
}
