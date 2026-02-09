import { ClienteWithEmpresaAndPlanosSchema } from '@/schemas/cliente.schema';
import React, { useEffect, useRef, useState } from 'react';
import { AdminGuard } from '../auth/AdminGuard';
import { LabelController } from '../global/label/LabelController';
import { LabelStatus } from '../global/label/LabelStatus';
import LoadingClienteInfo from '../global/loading/LoadingClienteInfor';
import { EditPenIcon, TrashIcon } from '../icons';

interface ClienteInfoProps {
  cliente?: ClienteWithEmpresaAndPlanosSchema | null;
  variant?: 'mini' | 'full';
  onEdit?: () => void;
  onDelete?: () => void;
  onPlanos?: () => void;
  loading?: boolean;
}

const EmailLabel = ({
  email,
  isAdmin,
}: {
  email: string;
  isAdmin?: boolean;
}) => (
  <LabelController
    label="E-mail:"
    value={
      isAdmin ? (
        <AdminGuard typeText>
          <span className="text-secondary ml-2">{email}</span>
        </AdminGuard>
      ) : (
        <span className="text-secondary ml-2">{email}</span>
      )
    }
  />
);

const EmpresaInfo = ({ empresa }: { empresa: any }) => (
  <>
    {empresa.razaoSocial && (
      <LabelController
        label="Razão Social:"
        value={<span className="ml-2">{empresa.razaoSocial}</span>}
      />
    )}
    {empresa.nomeFantasia && (
      <LabelController
        label="Nome Fantasia:"
        value={<span className="ml-2">{empresa.nomeFantasia}</span>}
      />
    )}
    <LabelController
      label="CNPJ:"
      value={
        <span className="ml-2">
          {empresa.cnpj
            ? empresa.cnpj.replace(
                /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
                '$1.$2.$3/$4-$5'
              )
            : ''}
        </span>
      }
    />
    {empresa.dataAbertura && (
      <LabelController
        label="Data de Abertura:"
        value={<span className="ml-2">{empresa.dataAbertura.toString()}</span>}
      />
    )}
  </>
);

const RepresentanteInfo = ({ representante }: { representante: any }) => (
  <div className="mb-2" key={representante.nome}>
    <LabelController label="CPF:" value={representante.cpf} />
    <LabelController label="Nome:" value={representante.nome} />
    <LabelController
      label="Data Nascimento:"
      value={representante.dataNascimento}
    />
    <LabelController label="Signo:" value={representante.signo} />
    <LabelController label="Sexo:" value={representante.sexo} />
  </div>
);

// eslint-disable-next-line
const ActionMenu: React.FC<{
  onEdit?: () => void;
  onDelete?: () => void;
  onPlanos?: () => void;
}> = ({ onEdit, onDelete, onPlanos }) => {
  const [showMenu, setShowMenu] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!showMenu) return;
    function handleClick(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showMenu]);

  return (
    <div className="absolute right-0 top-2 flex items-center z-10">
      <button
        ref={btnRef}
        type="button"
        title="Opções do cliente"
        className="hover:bg-white text-gray-700 p-2 transition flex items-center justify-center rounded-full"
        onClick={ev => {
          ev.stopPropagation();
          setShowMenu(v => !v);
        }}
      >
        <span className="material-icons text-[20px]">more_vert</span>
      </button>

      {showMenu && (
        <div
          ref={menuRef}
          className="absolute right-2 top-6 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg flex flex-col animate-fadeIn z-20"
        >
          <button
            title="Editar"
            onClick={() => {
              setShowMenu(false);
              onEdit && onEdit();
            }}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50 text-gray-700 bg-white border-0"
          >
            <EditPenIcon />
            Editar cliente
          </button>
          <button
            title="Deletar"
            onClick={() => {
              setShowMenu(false);
              onDelete && onDelete();
            }}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-red-50 text-red-600 bg-white border-0"
          >
            <TrashIcon />
            Excluir cliente
          </button>
        </div>
      )}
    </div>
  );
};

const ClienteInfo: React.FC<ClienteInfoProps> = ({
  cliente,
  variant = 'full',
  onEdit,
  onDelete,
  onPlanos,
  loading,
}) => {
  if (loading && !cliente) {
    return <LoadingClienteInfo variant={variant} />;
  }

  if (!cliente) {
    return (
      <div className="py-6 text-center text-gray-500">
        Nenhuma informação de cliente
      </div>
    );
  }

  const titulo = (
    <h1 className="text-2xl font-bold text-center text-primary w-full">
      Sobre Cliente
    </h1>
  );

  if (variant === 'mini') {
    return (
      <>
        {titulo}
        <ActionMenu onEdit={onEdit} onDelete={onDelete} onPlanos={onPlanos} />
        <div className="flex flex-col py-2">
          {cliente.status && <LabelStatus status={cliente.status} />}
          <LabelController
            label="CNPJ:"
            value={
              cliente.empresa?.cnpj
                ? cliente.empresa.cnpj.replace(
                    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
                    '$1.$2.$3/$4-$5'
                  )
                : ''
            }
          />
          {cliente.empresa && <EmpresaInfo empresa={cliente.empresa} />}
          {cliente.usuarioSistema?.email && (
            <EmailLabel email={cliente.usuarioSistema.email} />
          )}
        </div>
      </>
    );
  }

  return (
    <>
      {titulo}
      <div className="flex flex-col flex-wrap">
        <ActionMenu onEdit={onEdit} onDelete={onDelete} onPlanos={onPlanos} />
        <LabelStatus status={cliente.status} />

        {cliente.empresa && (
          <>
            {cliente.usuarioSistema?.email && (
              <EmailLabel email={cliente.usuarioSistema.email} isAdmin />
            )}
            <EmpresaInfo empresa={cliente.empresa} />
          </>
        )}

        {cliente?.email && (
          <LabelController
            label="Email:"
            value={
              <span className="ml-2 text-secondary font-semibold">
                {cliente.email}
              </span>
            }
          />
        )}

        {cliente.empresa?.representantes &&
          cliente.empresa.representantes.length > 0 && (
            <div
              title="Dados do representante"
              className="border-y py-2 border-gray-200"
            >
              <h3 className="text-lg text-primary font-bold mb-2">
                Dados do representante
              </h3>
              {cliente.empresa.representantes.map((representante: any) => (
                <RepresentanteInfo
                  representante={representante}
                  key={representante.nome}
                />
              ))}
            </div>
          )}
      </div>
    </>
  );
};

export default ClienteInfo;
