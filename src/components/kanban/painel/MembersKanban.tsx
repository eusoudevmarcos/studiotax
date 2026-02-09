import { buscarUsuariosSistema } from "@/axios/kanban.axios";
import { useDebouncedCallback } from "@/hooks/useDebounceCallback";
import {
  CardKanban,
  MembroCard,
  UsuarioSistema,
} from "@/schemas/kanban.schema";
import { getUsuarioNome } from "@/utils/kanban";
import { useCallback, useEffect, useState } from "react";
import { Painel, type popupPositionType } from "./Painel";

// Utilitário para Material Icon
const MaterialIcon = ({
  name,
  className = "",
  style = {},
  spin = false,
  ...rest
}: React.HTMLAttributes<HTMLElement> & { name: string; spin?: boolean }) => (
  <span
    className={`material-icons ${className} ${spin ? "animate-spin-slow" : ""}`}
    style={{ fontSize: "1.25em", verticalAlign: "middle", ...style }}
    {...rest}
  >
    {name}
  </span>
);

// CSS para animação do spinner
const styleString = `
@keyframes codex-spin { 100% { transform: rotate(360deg); } }
.animate-spin-slow { animation: codex-spin 1.2s linear infinite; }
`;

// Adiciona o estilo se ainda não existe
if (typeof window !== "undefined" && typeof document !== "undefined") {
  const styleTagId = "codex-members-materialicon-spin-style";
  if (!document.getElementById(styleTagId)) {
    const style = document.createElement("style");
    style.id = styleTagId;
    style.innerHTML = styleString;
    document.head.appendChild(style);
  }
}

interface MembersKanbanProps {
  popupPosition: popupPositionType;
  activePanel: string | null;
  setActivePanel: (
    activePanel: "labels" | "dates" | "checklist" | "members" | null,
  ) => void;
  card: CardKanban;
  onAdicionarMembro: (
    cardId: string,
    usuarioSistemaId: string,
  ) => Promise<void>;
  onRemoverMembro: (cardId: string, usuarioSistemaId: string) => Promise<void>;
  onUpdate?: () => void;
  buttonRef?: React.RefObject<HTMLButtonElement | null> | null;
}

export const MembersKanban = ({
  popupPosition,
  activePanel,
  setActivePanel,
  card,
  onAdicionarMembro,
  onRemoverMembro,
  onUpdate,
  buttonRef,
}: MembersKanbanProps) => {
  const [usuariosSugeridos, setUsuariosSugeridos] = useState<UsuarioSistema[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [addingMember, setAddingMember] = useState(false);
  const [searchUsuario, setSearchUsuario] = useState("");

  // Corrige a tipagem do debounce para aceitar "unknown[]", recebendo "args" e usando "args[0]" como string
  const buscarUsuariosCallback = useCallback(
    async (search: string) => {
      const termo = search.trim();

      if (!termo || termo.length < 2) {
        setUsuariosSugeridos([]);
        setShowAutocomplete(false);
        return;
      }

      setLoadingUsuarios(true);
      try {
        const usuarios = await buscarUsuariosSistema(termo, 10);
        const membrosIds = new Set(
          (card.membros || []).map((m) => m.usuarioSistemaId),
        );
        const usuariosDisponiveis = usuarios.filter(
          (u) => u && !membrosIds.has(u.id),
        );
        setUsuariosSugeridos(usuariosDisponiveis);
        setShowAutocomplete(usuariosDisponiveis.length > 0);
      } catch (error) {
        console.log("Erro ao buscar usuários:", error);
        setUsuariosSugeridos([]);
        setShowAutocomplete(false);
      } finally {
        setLoadingUsuarios(false);
      }
    },
    [card.membros],
  );

  // Corrigido: aceita (...args: unknown[]) => void; extrai termo de args[0]
  const buscarUsuariosDebounced = useDebouncedCallback(
    (...args: unknown[]) => {
      const search = typeof args[0] === "string" ? args[0] : "";
      buscarUsuariosCallback(search);
    },
    800,
  );

  useEffect(() => {
    const termo = searchUsuario.trim();
    if (!termo) {
      setUsuariosSugeridos([]);
      setShowAutocomplete(false);
      return;
    }
    buscarUsuariosDebounced(searchUsuario); // chamado corretamente
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchUsuario]);

  const handleAdicionarMembro = async (usuarioSistemaId: string) => {
    setAddingMember(true);
    try {
      await onAdicionarMembro(card.id, usuarioSistemaId);
      setSearchUsuario("");
      setUsuariosSugeridos([]);
      setShowAutocomplete(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log("Erro ao adicionar membro:", error);
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoverMembro = async (usuarioSistemaId: string) => {
    try {
      await onRemoverMembro(card.id, usuarioSistemaId);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log("Erro ao remover membro:", error);
    }
  };

  const getInfoMembro = (membro: MembroCard) => {
    return (
      membro.usuarioSistema?.funcionario?.pessoa?.nome ||
      membro.usuarioSistema?.cliente?.empresa?.nomeFantasia ||
      membro.usuarioSistema?.cliente?.empresa?.razaoSocial ||
      membro.usuarioSistema?.email
    );
  };

  // Fechar autocomplete ao clicar fora
  useEffect(() => {
    if (!showAutocomplete) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".autocomplete-container")) {
        setShowAutocomplete(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAutocomplete]);

  const Avatar = ({ membro }: { membro: MembroCard }) => {
    return (
      <div
        className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold mr-2 select-none"
        title={getInfoMembro(membro)}
      >
        {getInfoMembro(membro)
          ?.split(" ")
          .map((s) => s[0])
          .join("")
          .substring(0, 2)
          .toUpperCase()}
      </div>
    );
  };

  // Ajuste: Mostrar botão de delete SÓ no hover do container (usando group-hover)
  const MembrosList = () => {
    return (card.membros || []).map((membro: MembroCard) => (
      <div
        key={membro.usuarioSistemaId}
        className="flex items-center justify-between p-2 bg-gray-100 rounded group hover:bg-gray-200 transition-colors"
      >
        <div className="flex items-center">
          <Avatar membro={membro} />
          <span
            className="text-sm text-gray-700 truncate max-w-[200px] block"
            title={getInfoMembro(membro)}
          >
            {membro.usuarioSistema?.funcionario?.pessoa?.nome ||
              membro.usuarioSistema?.cliente?.empresa?.nomeFantasia ||
              membro.usuarioSistema?.cliente?.empresa?.razaoSocial ||
              membro.usuarioSistema?.email}
          </span>
        </div>
        <button
          type="button"
          onClick={() => handleRemoverMembro(membro.usuarioSistemaId)}
          className="text-red-500 opacity-0 group-hover:opacity-100 hover:text-red-700 transition-opacity ml-2 cursor-pointer"
        >
          <MaterialIcon name="close" className="w-4 h-4" />
        </button>
      </div>
    ));
  };

  return (
    <>
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={() =>
            setActivePanel(activePanel === "members" ? null : "members")
          }
          className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium transition-colors ${
            activePanel === "members"
              ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <MaterialIcon name="groups" className="w-4 h-4" />
          Membros
        </button>
        <div
          className="absolute top-9 left-1/2 -translate-x-1/2 z-10 flex"
          style={{ height: "2rem", minWidth: "2rem" }}
        >
          {card.membros?.map((membro: MembroCard, idx: number) => (
            <div
              key={membro.usuarioSistemaId}
              className="absolute"
              style={{
                left: `${idx * 1.4}rem`,
                zIndex: card.membros?.length ? card.membros.length - idx : 0,
                width: "2rem",
                height: "2rem",
              }}
            >
              <Avatar membro={membro} />
            </div>
          ))}
        </div>
      </div>

      {activePanel === "members" && popupPosition && (
        <Painel
          popupPosition={popupPosition}
          title="Membros"
          panelType="members"
        >
          <>
            <div className="mb-1 autocomplete-container relative">
              <input
                type="text"
                value={searchUsuario}
                onChange={(e) => setSearchUsuario(e.target.value)}
                placeholder="Buscar usuário..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {showAutocomplete && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {usuariosSugeridos
                    .filter((u): u is UsuarioSistema => Boolean(u))
                    .map((usuario: UsuarioSistema) => (
                      <button
                        key={usuario!.id}
                        type="button"
                        onClick={() => handleAdicionarMembro(usuario!.id)}
                        disabled={addingMember}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      >
                        {getUsuarioNome(usuario)}
                      </button>
                    ))}
                </div>
              )}
              {loadingUsuarios && (
                <div className="absolute right-3 top-2.5">
                  <MaterialIcon
                    name="autorenew"
                    className="text-gray-400"
                    spin
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <MembrosList />
              {(!card.membros || card.membros.length === 0) && (
                <p className="text-sm text-gray-400 text-center py-1">
                  Nenhum membro adicionado
                </p>
              )}
            </div>
          </>
        </Painel>
      )}
    </>
  );
};
