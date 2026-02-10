/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContatoInput } from '@/schemas/contato.schema';
import { makeName } from '@/utils/makeName';
import { useFormContext, UseFormReturn } from 'react-hook-form';
import { FormInput } from '../input/FormInput';

type ContatoFormProps = {
  namePrefix: string; // ex: "empresa.contatos[0]"
  formContexto?: UseFormReturn;
  onSubmit?: (data: any) => void;
};

function ContatoFormInner({ namePrefix }: { namePrefix: string }) {
  const telefoneName = makeName<ContatoInput>(namePrefix, 'telefone');
  const whatsappName = makeName<ContatoInput>(namePrefix, 'whatsapp');
  const emailName = makeName<ContatoInput>(namePrefix, 'email');

  return (
    <>
      <FormInput
        name={telefoneName}
        maskProps={{ mask: '(00) 0000-0000' }}
        label="Telefone"
        placeholder="(00) 0000-0000"
      />

      <FormInput
        name={whatsappName}
        maskProps={{ mask: '(00) 00000-0000' }}
        label="Celular/WhatsApp"
        placeholder="(00) 00000-0000"
      />

      <FormInput
        name={emailName}
        label="E-mail"
        placeholder="comercialaura@gmail.com"
        type="email"
      />
    </>
  );
}
export function ContatoForm({ namePrefix = 'contatos[0]' }: ContatoFormProps) {
  const methods = useFormContext<ContatoInput>();

  return <ContatoFormInner namePrefix={namePrefix} />;
}

export default ContatoForm;
