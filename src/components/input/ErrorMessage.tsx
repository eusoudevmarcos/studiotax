// Mensagem de erro em formato de balão flutuante
export const ErrorMessage = ({
  message,
  top,
}: {
  message: string | null;
  top?: string;
}) =>
  message ? (
    <div
      className="absolute left-0 right-0 flex justify-start pointer-events-none w-fit"
      style={{ top: top ?? '40px', zIndex: 20 }}
    >
      <div className="relative">
        <div
          className="
            bg-white
            text-red-500
            border-red-500
            border
            text-xs
            px-1
            py-1
            rounded-lg
            shadow-lg
            shadow-red-300/40
            animate-fade-in
            font-semibold
            pointer-events-auto
            "
          style={{
            boxShadow:
              '0 4px 16px 0 rgba(239,68,68,0.18), 0 1.5px 4px 0 rgba(239,68,68,0.12)',
          }}
        >
          {message}
          {/* Ponta do balão */}
          <span
            className="absolute left-4"
            style={{
              bottom: '100%',
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderBottom: '10px solid #ef4444',
              filter: 'drop-shadow(0 2px 2px rgba(239,68,68,0.15))',
            }}
          />
        </div>
      </div>
    </div>
  ) : null;
