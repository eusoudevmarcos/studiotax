import {
  StatusClienteEnum,
  StatusClienteEnumInput,
} from '@/schemas/statusClienteEnum.schema';
import { StatusVagaEnum } from '@/schemas/vaga.schema';
import { LabelController } from './LabelController';

export const LabelStatus = ({
  status,
}: {
  status: StatusClienteEnumInput | StatusVagaEnum;
}) => {
  let statusBgColor = 'bg-[#ede9fe]';

  // Cores ajustadas para representar melhor o sentido dos status
  switch (status) {
    case StatusClienteEnum.enum.ATIVO:
      // Sucesso/Presente
      statusBgColor = 'bg-emerald-600 text-white';
      break;
    case StatusVagaEnum.enum.ABERTA:
      // Disponível/Sucesso
      statusBgColor = 'bg-teal-500 text-white';
      break;
    case StatusClienteEnum.enum.INATIVO:
      // Atenção importante/Perigo
      statusBgColor = 'bg-rose-600 text-white';
      break;
    case StatusClienteEnum.enum.LEAD:
      // Aviso, oportunidade em progresso
      statusBgColor = 'bg-amber-500 text-white';
      break;
    case StatusClienteEnum.enum.PROSPECT:
      // Estado inicial/Em preparação
      statusBgColor = 'bg-sky-400 text-white';
      break;
    default:
      statusBgColor = 'bg-zinc-200 text-gray-700';
      break;
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <LabelController
        label="Status:"
        value={
          <span
            className={`${statusBgColor} text-xs font-semibold px-3 py-1 rounded-full`}
          >
            {status}
          </span>
        }
      />
    </div>
  );
};
