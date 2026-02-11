/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

// Por referência à definição:
export enum TypeFile {
  PDF = 'pdf',
  DOC = 'doc',
  DOCX = 'docx',
  XLS = 'xls',
  XLSX = 'xlsx',
  CSV = 'csv',
  JPG = 'jpg',
  JPEG = 'jpeg',
  PNG = 'png',
  TXT = 'txt',
}

export interface UploadedFile {
  id?: string;
  nomeArquivo: string;
  path: string; // Note: Este campo você pode passar vazio no frontend
  buffer: any; // usaremos File ou Blob do browser, mas o backend espera Buffer
  mimetype?: string;
  tamanhoKb?: number;
  tipo: TypeFile;
}

type UploadFilesInput = {
  files: Omit<UploadedFile, 'buffer' | 'path'> & { fileObj: File }[];
};

type UploadProps = {
  name?: string; // Nome dentro do useForm, padrão "files"
};

function getFileExtension(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  return ext || '';
}

function getTypeFileFromExt(ext: string): TypeFile | undefined {
  switch (ext) {
    case 'pdf':
      return TypeFile.PDF;
    case 'doc':
      return TypeFile.DOC;
    case 'docx':
      return TypeFile.DOCX;
    case 'xls':
      return TypeFile.XLS;
    case 'xlsx':
      return TypeFile.XLSX;
    case 'csv':
      return TypeFile.CSV;
    case 'jpg':
      return TypeFile.JPG;
    case 'jpeg':
      return TypeFile.JPEG;
    case 'png':
      return TypeFile.PNG;
    case 'txt':
      return TypeFile.TXT;
    default:
      return undefined;
  }
}

export const FileUploadForm: React.FC<UploadProps> = ({ name = 'anexos' }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState('');
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  useEffect(() => {}, [fields]);

  // Lida com seleção de arquivos pelo usuário e adiciona ao form context
  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Pega os arquivos já enviados pelo usuário
    const alreadyUploaded = Array.isArray(fields) ? fields : [];

    for (const file of files) {
      const ext = getFileExtension(file.name);
      const typeFile = getTypeFileFromExt(ext) as TypeFile | undefined;

      const arquivoJaExiste = alreadyUploaded.some((item: any) => {
        const nomeExistente =
          item.nomeArquivo || (item.anexo && item.anexo.nomeArquivo);
        return nomeExistente === file.name;
      });

      if (arquivoJaExiste) {
        setError(`Já existe um arquivo com o nome "${file.name}" adicionado.`);
        continue;
      }

      const mesmoFormatoExiste = alreadyUploaded.some((item: any) => {
        const tipoExistente =
          item.anexo.tamanhoKb || (item.anexo && item.anexo.tamanhoKb);
        return tipoExistente === typeFile;
      });

      if (mesmoFormatoExiste) {
        setError(
          `Já existe um arquivo do tipo "${ext}" (${typeFile}). Não é permitido enviar múltiplos arquivos do mesmo tipo/formato.`
        );
        continue;
      }

      if (!typeFile) {
        alert(`Tipo de arquivo não suportado para: ${file.name}`);
        continue;
      }

      const uploaded: Omit<UploadedFile, 'buffer' | 'path'> & {
        fileObj: File;
      } = {
        nomeArquivo: file.name,
        mimetype: file.type,
        tamanhoKb: file.size,
        tipo: typeFile,
        fileObj: file,
      };
      append({ anexo: { ...uploaded } });
    }

    if (inputRef.current) inputRef.current.value = '';
  };

  const handleRemove = (idx: number) => {
    remove(idx);
  };

  return (
    <section className="mb-4">
      <div className="border-2 border-primary h-32 rounded-lg bg-purple-100 border-dashed flex items-center justify-center relative mb-4 flex-col hover:scale-[1.01] hover:bg-purple-200 cursor-pointer">
        <span className="material-icons-outlined text-primary text-5xl!">
          upload_file
        </span>
        <p className="text-primary">Selecione o arquivo</p>
        <input
          type="file"
          multiple
          ref={inputRef}
          placeholder=""
          className="block mb-2 border w-full h-full z-10 absolute top-0 opacity-0"
          onChange={handleFilesChange}
        />
        <p className="text-primary absolute bottom-2 left-2 text-sm opacity-70">
          Total de Arquivos: {fields.length}
        </p>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <ul className="space-y-2 mt-4">
        {fields.map((field: any, idx: number) => (
          <li
            key={field.id}
            className="flex items-center justify-between bg-gray-100 rounded px-3 py-2"
          >
            <div className="flex flex-col gap-1">
              <span className="font-medium">{field.anexo.nomeArquivo}</span>
              <span className="text-xs text-gray-500">
                {field.anexo.mimetype || ''} • {field.anexo.tamanhoKb} KB
              </span>
              <span className="text-xs text-blue-700">
                Tipo: {field.anexo.tipo}
              </span>
            </div>
            <button
              className="ml-4 px-2 py-1 text-sm rounded text-black bg-red-500 hover:bg-red-600"
              type="button"
              onClick={() => handleRemove(idx)}
            >
              Remover
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default FileUploadForm;
