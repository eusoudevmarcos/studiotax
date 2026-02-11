// pages/cliente/[uuid].tsx
import api from "@/axios";
import { getClienteById } from "@/axios/cliente.axios";
import { PrimaryButton } from "@/components/button/PrimaryButton";
import Card from "@/components/Card";
import ClienteInfo from "@/components/cliente/ClienteInfo";
import VagaForm from "@/components/form/VagaForm";
import { Tab } from "@/components/global/tab/Tab";
import { PlusIcon } from "@/components/icons";
import Modal from "@/components/modal/Modal";
import ModalClienteForm from "@/components/modal/ModalClienteForm";
import { ModalPlanoCliente } from "@/components/modal/ModalPlanoCliente";
import { useAdmin } from "@/context/AuthContext";
import { ClienteWithEmpresaAndVagaInput } from "@/schemas/cliente.schema";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const TAB_OPCOES = [
  { label: "Sobre Cliente", value: "cliente" },
];

const ClientePage: React.FC<{
  initialValues?: ClienteWithEmpresaAndVagaInput;
}> = ({ initialValues }) => {
  const router = useRouter();
  const { uuid } = router.query;

  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setPaginaAtual] = useState(1);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showVagasForm, setShowVagasForm] = useState(false);
  const [modalPlanosCliente, setModalPlanosCliente] = useState(false);
  const [modalVagasCliente, setModalVagasCliente] = useState(false);
  const [cliente, setCliente] = useState<ClienteWithEmpresaAndVagaInput | null>(
    initialValues ?? null,
  );

  const [, setClienteCarregado] = useState<boolean>(!!initialValues);

  // Variável para controlar aba ativa do Tab
  const [tab, setTab] = useState<string>("cliente");

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
      } catch {
        setErro("Cliente não encontrado ou erro ao buscar dados.");
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
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        const response = await api.delete(`/api/externalWithAuth/cliente`, {
          data: { id: cliente.id },
        });
        if (response.data) {
          await router.push("/clientes");
        }
      } catch {
        alert("Erro ao excluir cliente.");
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
            className="px-2 py-2 text-primary text-black rounded hover:scale-110 cursor-pointer"
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
        />
      </section>

      {tab === "cliente" && (
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

      {showModalEdit && (
        <ModalClienteForm
          isOpen={showModalEdit}
          onClose={() => setShowModalEdit(false)}
          initialValues={cliente ?? undefined}
          onSuccess={(clienteAtualizado) => {
            setCliente(clienteAtualizado as typeof cliente);
          }}
        />
      )}
    </div>
  );
};

export default ClientePage;
