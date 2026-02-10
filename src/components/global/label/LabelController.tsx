export const LabelController = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => {
  return (
    <div className="flex items-center gap-2 mb-1">
      <span className="font-medium text-primary">{label}</span>
      <span className={`${value ? 'text-secondary' : 'text-gray-400'}`}>
        {value ? value : 'N/A'}
      </span>
    </div>
  );
};
