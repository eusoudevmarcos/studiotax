// pages/cliente/[uuid].tsx
import api from "@/axios";
import {
  AnaliseTributariaClienteStudio,
  createAnaliseTributariaForClienteStudio,
  getAnalisesTributariasByClienteStudioId,
  getClienteById,
} from "@/axios/cliente.axios";
import { PrimaryButton } from "@/components/button/PrimaryButton";
import Card from "@/components/Card";
import ClienteInfo from "@/components/cliente/ClienteInfo";
import { Tab } from "@/components/global/tab/Tab";
import { PlusIcon } from "@/components/icons";
import Modal from "@/components/modal/Modal";
import ModalClienteForm from "@/components/modal/ModalClienteForm";
import { ModalPlanoCliente } from "@/components/modal/ModalPlanoCliente";
import { useAdmin } from "@/context/AuthContext";
import { ClienteWithEmpresaInput } from "@/schemas/cliente.schema";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

const TAB_OPCOES = [{ label: "Sobre Cliente", value: "cliente" }];

const ORIGEM_CREDITO_OPTIONS: { value: string; label: string }[] = [
  { value: "ICMS", label: "ICMS" },
  { value: "PIS_COFINS", label: "PIS/COFINS" },
  { value: "IRPJ", label: "IRPJ" },
  { value: "CSLL", label: "CSLL" },
  { value: "OUTROS", label: "Outros" },
];

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const ClientePage: React.FC<{
  initialValues?: ClienteWithEmpresaInput;
}> = ({ initialValues }) => {
  const router = useRouter();
  const { uuid } = router.query;

  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setPaginaAtual] = useState(1);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [modalPlanosCliente, setModalPlanosCliente] = useState(false);
  const [cliente, setCliente] = useState<ClienteWithEmpresaInput | null>(
    initialValues ?? null,
  );

  const [, setClienteCarregado] = useState<boolean>(!!initialValues);

  // Variável para controlar aba ativa do Tab
  const [tab, setTab] = useState<string>("cliente");

  // Ajuste dos states da modal de análise tributária
  const [showModalAnaliseTributaria, setShowModalAnaliseTributaria] =
    useState(false);
  const [analisesTributarias, setAnalisesTributarias] = useState<
    AnaliseTributariaClienteStudio[]
  >([]);
  const [loadingAnalises, setLoadingAnalises] = useState(false);
  const [salvandoAnalise, setSalvandoAnalise] = useState(false);
  const [erroAnalises, setErroAnalises] = useState<string | null>(null);
  const [novoCreditoFiscal, setNovoCreditoFiscal] = useState<string>("");
  const [novaOrigemCredito, setNovaOrigemCredito] = useState<string>("");

  const carregarAnalisesTributarias = useCallback(async (clienteId: string) => {
    setLoadingAnalises(true);
    setErroAnalises(null);
    try {
      const data = await getAnalisesTributariasByClienteStudioId(clienteId);
      setAnalisesTributarias(data);
    } catch {
      setErroAnalises("Erro ao carregar análises tributárias.");
    } finally {
      setLoadingAnalises(false);
    }
  }, []);

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
        const clienteResponse = await getClienteById(uuid as string);

        // vagas removidas do modelo
        setCliente(clienteResponse);
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

  useEffect(() => {
    if (!cliente?.id) return;
    void carregarAnalisesTributarias(cliente.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cliente?.id]);

  const handleTrash = async () => {
    if (!cliente) return;
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        const response = await api.delete(
          `/api/externalWithAuth/cliente-studio/`,
          {
            data: { id: cliente.id },
          },
        );
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

  const handleCreateAnaliseTributaria = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (!cliente?.id) return;
    if (!novoCreditoFiscal || !novaOrigemCredito) return;

    // Converte string de moeda brasileira para número
    const valorNormalizado = novoCreditoFiscal
      .replace(/\./g, "")
      .replace(",", ".");
    const creditoFiscalNumero = Number(valorNormalizado);

    if (Number.isNaN(creditoFiscalNumero)) {
      alert("Informe um valor válido para o crédito fiscal.");
      return;
    }

    try {
      setSalvandoAnalise(true);
      await createAnaliseTributariaForClienteStudio(cliente.id, {
        creditoFiscal: creditoFiscalNumero,
        origemCredito: novaOrigemCredito,
      });

      setNovoCreditoFiscal("");
      setNovaOrigemCredito("");
      setShowModalAnaliseTributaria(false);

      await carregarAnalisesTributarias(cliente.id);
    } catch {
      alert("Erro ao salvar análise tributária.");
    } finally {
      setSalvandoAnalise(false);
    }
  };

  // if (loading) {
  //   return <Loading label="Carregando Cliente..." />;
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

        <Tab tabs={TAB_OPCOES} value={tab} onChange={setTab} />
      </section>

      {tab === "cliente" && (
        <>
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

          <Card classNameContainer="mt-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold text-primary">
                    Análise Tributária
                  </h2>
                  <PrimaryButton
                    type="button"
                    onClick={() => {
                      setShowModalAnaliseTributaria(true);
                      setNovoCreditoFiscal("");
                      setNovaOrigemCredito("");
                    }}
                    className="flex items-center gap-2"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Nova análise
                  </PrimaryButton>
                </div>

                {erroAnalises && (
                  <p className="text-red-600 text-sm mb-2">{erroAnalises}</p>
                )}

                {loadingAnalises ? (
                  <p className="text-gray-500 text-sm">
                    Carregando análises tributárias...
                  </p>
                ) : analisesTributarias.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    Nenhuma análise tributária registrada.
                  </p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {analisesTributarias &&
                      analisesTributarias.length > 0 &&
                      analisesTributarias.map((analise) => (
                        <li key={analise.id} className="py-2 text-sm">
                          <div className="flex flex-col">
                            <span className="font-semibold">
                              Crédito fiscal apurado/disponível:{" "}
                              {currencyFormatter.format(analise.creditoFiscal)}
                            </span>
                            <span>
                              Origem do crédito fiscal:{" "}
                              {ORIGEM_CREDITO_OPTIONS.find(
                                (opt) => opt.value === analise.origemCredito,
                              )?.label ?? analise.origemCredito}
                            </span>
                            <span className="text-gray-500">
                              Criada em:{" "}
                              {new Date(analise.createdAt).toLocaleDateString(
                                "pt-BR",
                              )}
                            </span>
                          </div>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          </Card>
        </>
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

      {showModalAnaliseTributaria && (
        <Modal
          isOpen={showModalAnaliseTributaria}
          onClose={() => setShowModalAnaliseTributaria(false)}
          title="Nova Análise Tributária"
        >
          <div className="md:w-1/2">
            <h3 className="text-lg font-semibold text-primary mb-2">
              Nova análise tributária
            </h3>
            <form
              onSubmit={handleCreateAnaliseTributaria}
              className="space-y-3"
            >
              <div>
                <label
                  htmlFor="creditoFiscal"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Crédito fiscal apurado/disponível
                </label>
                <input
                  id="creditoFiscal"
                  type="text"
                  className="shadow appearance-none border rounded py-2 px-3 text-gray-700 w-full leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Ex.: 10.000,00"
                  value={novoCreditoFiscal}
                  onChange={(e) => setNovoCreditoFiscal(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="origemCredito"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Origem do crédito fiscal
                </label>
                <select
                  id="origemCredito"
                  className="shadow appearance-none border rounded py-2 px-3 text-gray-700 w-full leading-tight focus:outline-none focus:shadow-outline"
                  value={novaOrigemCredito}
                  onChange={(e) => setNovaOrigemCredito(e.target.value)}
                >
                  <option value="">Selecione uma origem</option>
                  {ORIGEM_CREDITO_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <PrimaryButton
                  type="submit"
                  disabled={
                    salvandoAnalise ||
                    !novoCreditoFiscal.trim() ||
                    !novaOrigemCredito
                  }
                >
                  {salvandoAnalise ? "Salvando..." : "Salvar análise"}
                </PrimaryButton>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ClientePage;
