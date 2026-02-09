// pages/cliente/[uuid].tsx
import api from '@/axios';
import { getClienteById } from '@/axios/cliente.axios';
import { PrimaryButton } from '@/components/button/PrimaryButton';
import Card from '@/components/Card';
import ClienteInfo from '@/components/cliente/ClienteInfo';
import VagaForm from '@/components/form/VagaForm';
import { Tab } from '@/components/global/tab/Tab';
import { PlusIcon } from '@/components/icons';
import VagaList from '@/components/list/VagaList';
import Modal from '@/components/modal/Modal';
import ModalClienteForm from '@/components/modal/ModalClienteForm';
import { ModalPlanoCliente } from '@/components/modal/ModalPlanoCliente';
import { ModalVagasCliente } from '@/components/modal/ModalVagasCliente';
import { useAdmin } from '@/context/AuthContext';
import { ClienteWithEmpresaAndVagaInput } from '@/schemas/cliente.schema';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const TAB_OPCOES = [
  { label: 'Sobre Cliente', value: 'cliente' },
  { label: 'Ver Vagas', value: 'vagas' },
];

const ClientePage: React.FC<{
  initialValues?: ClienteWithEmpresaAndVagaInput;
}> = ({ initialValues }) => {
  const router = useRouter();
  const { uuid } = router.query;

  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showVagasForm, setShowVagasForm] = useState(false);
  const [modalPlanosCliente, setModalPlanosCliente] = useState(false);
  const [modalVagasCliente, setModalVagasCliente] = useState(false);
  const [cliente, setCliente] = useState<ClienteWithEmpresaAndVagaInput | null>(
    initialValues ?? null
  );

  const [clienteCarregado, setClienteCarregado] = useState<boolean>(
    !!initialValues
  );

  // Variável para controlar aba ativa do Tab
  const [tab, setTab] = useState<string>('cliente');

  const isAdmin = useAdmin();

  useEffect(() => {
    if (!uuid || initialValues) {
      setLoading(false);
      setClienteCarregado(true);
      return;
    }

    const fetchCliente = async () => {
      setLoading(true);
      setErro(null);
      try {
        const cliente = await getClienteById(uuid as string);

        // const vagas = await getVagasClienteById(uuid as string);
        // cliente.vagas = { ...vagas };
        setCliente(cliente);
        setClienteCarregado(true);
      } catch (_) {
        setErro('Cliente não encontrado ou erro ao buscar dados.');
        setCliente(null);
        setClienteCarregado(false);
      } finally {
        setLoading(false);
      }
    };

    fetchCliente();
  }, [uuid, initialValues]);

  const handleTrash = async () => {
    if (!cliente) return;
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        const response = await api.delete(`/api/externalWithAuth/cliente`, {
          data: { id: cliente.id },
        });
        if (response.data) {
          await router.push('/clientes');
        }
      } catch {
        alert('Erro ao excluir cliente.');
      }
    }
  };

  React.useEffect(() => {
    setPaginaAtual(1);
  }, [cliente]);

  const handleEdit = () => setShowModalEdit(true);
  const handleViewPlanos = () => setModalPlanosCliente(true);

  // if (loading) {
  //   return <Loading label="Carregando Cliente e Vagas..." />;
  // }

  if (erro) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <span className="text-red-600 text-xl font-semibold mb-4">{erro}</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-1">
      <section className="flex justify-between">
        {!initialValues && (
          <button
            className="px-2 py-2 text-primary text-white rounded hover:scale-110 cursor-pointer"
            onClick={() => router.back()}
          >
            <span className="material-icons align-middle mr-2">arrow_back</span>
            Voltar
          </button>
        )}

        <Tab
          tabs={TAB_OPCOES}
          value={tab}
          onChange={setTab}
          tabsOptions={{ vagas: { _count: cliente?.vagas?._count ?? 0 } }}
        />
      </section>

      {tab === 'cliente' && (
        <Card>
          <ClienteInfo
            cliente={cliente}
            variant="full"
            onEdit={handleEdit}
            onDelete={handleTrash}
            onPlanos={handleViewPlanos}
            loading={loading}
          />
        </Card>
      )}

      {tab === 'vagas' && (
        <>
          <div className="flex justify-center relative mb-2">
            <h3 className="text-2xl font-bold text-center text-primary w-full max-w-md wrap-break-word">
              Vagas de {cliente?.empresa.razaoSocial}
            </h3>

            <PrimaryButton
              className="float-right flex text-nowrap absolute right-0 top-0"
              onClick={() => setShowVagasForm(true)}
            >
              <PlusIcon />
              <p className="hidden md:block">Cadastrar Vaga</p>
            </PrimaryButton>
          </div>

          <VagaList />
        </>
      )}

      {cliente?.planos && (
        <ModalPlanoCliente
          isOpen={modalPlanosCliente}
          onClose={() => {
            setModalPlanosCliente(false);
          }}
          planos={cliente.planos as any}
        />
      )}

      {modalVagasCliente && (
        <ModalVagasCliente open={modalVagasCliente} uuid={uuid as string} />
      )}

      {showModalEdit && (
        <ModalClienteForm
          isOpen={showModalEdit}
          onClose={() => setShowModalEdit(false)}
          initialValues={cliente}
          onSuccess={clienteAtualizado => {
            setCliente(clienteAtualizado);
          }}
        />
      )}

      {showVagasForm && (
        <Modal
          isOpen={showVagasForm}
          onClose={() => {
            setShowVagasForm(false);
          }}
          title={`Vaga do cliente`}
        >
          <VagaForm
            onSuccess={vaga => {
              setShowVagasForm(false);
              // Atualizar as vagas após cadastrar uma nova vaga
              // refetchVagas({ search: cliente.id });
            }}
            initialValues={{ cliente } as any}
            isBtnDelete={false}
            isBtnView={false}
            showInput={false}
          />
        </Modal>
      )}
    </div>
  );
};

export default ClientePage;
