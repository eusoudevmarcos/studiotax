import api from '@/axios';
import Card from '@/components/Card';
import { FuncionarioForm } from '@/components/form/FuncionarioForm';
import { EditPenIcon, TrashIcon } from '@/components/icons';
import Modal from '@/components/modal/Modal';
import { FuncionarioInput } from '@/schemas/funcionario.schema';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const FuncionarioPage: React.FC = () => {
  const router = useRouter();
  const { uuid } = router.query;

  const [funcionario, setFuncionario] = useState<FuncionarioInput | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModalEdit, setShowModalEdit] = useState<boolean>(false);
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);
  const [openCount, setOpenCount] = useState<number>(1);

  useEffect(() => {
    if (!uuid) return;

    const fetchFuncionario = async () => {
      setLoading(true);
      setErro(null);
      try {
        const response = await api.get(
          `/api/externalWithAuth/funcionario-studio/${uuid}`
        );
        setFuncionario(response.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (_: any) {
        setErro('Funcionário não encontrado ou erro ao buscar dados.');
        setFuncionario(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFuncionario();
  }, [uuid]);

  const handleDelete = async () => {
    if (!uuid) return;

    setLoading(true);
    try {
      await api.delete(`/api/externalWithAuth/funcionario-studio/delete`, {
        data: { id: uuid },
      });
      await router.back();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (_: any) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-4 text-primary text-lg">Carregando...</span>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <span className="text-red-600 text-xl font-semibold mb-4">{erro}</span>
      </div>
    );
  }

  if (!funcionario) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <section className="bg-white p-4 rounded-2xl">
        <div className="flex mb-8">
          <button
            className="px-2 py-2 bg-primary text-white rounded shadow-md hover:scale-110 hover:duration-200 cursor-pointer"
            onClick={async () => await router.back()}
          >
            Voltar
          </button>
          <h1 className="text-2xl font-bold text-center text-primary w-full">
            Detalhes do Funcionário
          </h1>

          <div className="flex gap-2">
            <button
              className="px-2 py-2 bg-[#5f82f3] text-white rounded shadow-md hover:scale-110 hover:duration-200 cursor-pointer"
              onClick={() => setShowModalEdit(true)}
            >
              <EditPenIcon />
            </button>
            <button
              className="px-2 py-2 bg-[#f72929] text-white rounded shadow-md hover:scale-110 hover:duration-200 cursor-pointer"
              onClick={() => setModalDelete(true)}
            >
              <TrashIcon />
            </button>
          </div>
        </div>
        <div className="flex gap-4 flex-wrap md:flex-nowrap">
          <Card title="Informações Gerais">
            <p>
              <span className="font-medium">Email:</span>{' '}
              <span className="text-secondary">{funcionario.email}</span>
            </p>
            <p>
              <span className="font-medium">Tipo de Usuário:</span>{' '}
              <span className="text-secondary">{funcionario.tipoUsuario}</span>
            </p>
            <p>
              <span className="font-medium">Setor:</span>{' '}
              <span className="text-secondary">
                {funcionario?.funcionario?.setor ?? 'N/A'}
              </span>
            </p>
            <p>
              <span className="font-medium">Cargo:</span>{' '}
              <span className="text-secondary">
                {funcionario?.funcionario?.cargo ?? 'N/A'}
              </span>
            </p>
          </Card>
          {funcionario?.funcionario?.pessoa && (
            <Card title="Dados da Pessoa">
              <p>
                <span className="font-medium">Nome:</span>{' '}
                <span className="text-secondary">
                  {funcionario.funcionario.pessoa.nome}
                </span>
              </p>
              <p>
                <span className="font-medium">CPF:</span>{' '}
                <span className="text-secondary">
                  {funcionario.funcionario.pessoa.cpf}
                </span>
              </p>
              <p>
                <span className="font-medium">Data de Nascimento:</span>{' '}
                <span className="text-secondary">
                  {funcionario?.funcionario.pessoa?.dataNascimento &&
                    funcionario?.funcionario.pessoa?.dataNascimento.toString()}
                </span>
              </p>
              <p>
                <span className="font-medium">RG:</span>{' '}
                <span className="text-secondary">
                  {funcionario.funcionario.pessoa.rg}
                </span>
              </p>
              {/* <p>
                <span className="font-medium">Estado Civil:</span> <span className="text-secondary">{funcionario.pessoa.estadoCivil}</span>
              </p> */}
            </Card>
          )}
          {funcionario?.cliente?.empresa && (
            <Card title="Dados da Empresa">
              <p>
                <span className="font-medium">Razão Social:</span>{' '}
                <span className="text-secondary">
                  {funcionario.cliente.empresa.razaoSocial}
                </span>
              </p>
              <p>
                <span className="font-medium">CNPJ:</span>{' '}
                <span className="text-secondary">
                  {funcionario.cliente.empresa.cnpj}
                </span>
              </p>
              {funcionario?.cliente.empresa?.dataAbertura && (
                <p>
                  <span className="font-medium">Data de Abertura:</span>{' '}
                  <span className="text-secondary">
                    {funcionario.cliente.empresa.dataAbertura}
                  </span>
                </p>
              )}
            </Card>
          )}
        </div>
      </section>

      <Modal
        isOpen={showModalEdit}
        onClose={() => {
          setShowModalEdit(false);
          setOpenCount(openCount + 1);
        }}
        title="Editar Funcionario"
      >
        {showModalEdit && (
          <FuncionarioForm
            key={openCount}
            onSuccess={funcionario => {
              setFuncionario(funcionario);
              setShowModalEdit(false);
            }}
            initialValues={funcionario}
          />
        )}
      </Modal>

      <Modal
        isOpen={modalDelete}
        onClose={() => setModalDelete(false)}
        title="Tem certeza que deseja deletar o Funcionario?"
        fit
      >
        <div className="flex gap-2 justify-center">
          <button
            className="px-2 py-2 bg-[#f72929] text-white rounded shadow-md hover:scale-110 hover:duration-200 cursor-pointer"
            onClick={() => handleDelete()}
          >
            SIM
          </button>
          <button
            className="px-2 py-2 bg-primary text-white rounded shadow-md hover:scale-110 hover:duration-200 cursor-pointer"
            onClick={() => setModalDelete(false)}
          >
            NÂO
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default FuncionarioPage;
