interface LoadingProps {
  label?: string;
}

export default function Loading({ label }: LoadingProps) {
  return (
    <div className="flex justify-center items-center h-64 flex-col gap-2">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <span className="ml-4 text-primary text-lg">
        {label ?? 'Carregando...'}
      </span>
    </div>
  );
}
