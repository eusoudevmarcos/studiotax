import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { PrimaryButton } from '../button/PrimaryButton';
import { FormInput } from '../input/FormInput';

type FormacaoFormProps = {
  namePrefix?: string;
};

const FormacaoForm: React.FC<FormacaoFormProps> = ({ namePrefix = '' }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${namePrefix}formacoes`,
  });

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border p-4 rounded-md space-y-2 relative"
        >
          <h4 className="font-semibold text-lg text-primary">
            Formação #{index + 1}
          </h4>
          <FormInput
            name={`${namePrefix}formacoes.${index}.dataConclusaoMedicina`}
            control={control}
            label="Data Conclusão Medicina"
            placeholder="00/00/0000"
            errors={errors}
            inputProps={{ type: 'date' }}
          />
          <FormInput
            name={`${namePrefix}formacoes.${index}.dataConclusaoResidencia`}
            control={control}
            label="Data Conclusão Residência"
            placeholder="00/00/0000"
            errors={errors}
            inputProps={{ type: 'date' }}
          />
          {fields.length > 0 && (
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xl"
              title="Remover formação"
            >
              &times;
            </button>
          )}
        </div>
      ))}
      <PrimaryButton
        type="button"
        onClick={() =>
          append({ dataConclusaoMedicina: '', dataConclusaoResidencia: '' })
        }
        className="mt-4"
      >
        Adicionar Formação
      </PrimaryButton>
    </div>
  );
};

export default FormacaoForm;
