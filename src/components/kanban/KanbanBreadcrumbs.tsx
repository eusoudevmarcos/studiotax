import { useRouter } from 'next/router';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export const KanbanBreadcrumbs: React.FC = () => {
  const router = useRouter();

  const breadcrumbs = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      {
        label: 'Espaços de Trabalho',
        href: '/kanban',
      },
    ];

    // Se estamos em /kanban/espaco/[espacoId]
    if (
      router.pathname.includes('/espaco/') &&
      !router.pathname.includes('/quadro/')
    ) {
      const espacoId = router.query.espacoId;
      if (espacoId && typeof espacoId === 'string') {
        items.push({
          label: 'Quadros',
          href: `/kanban/espaco/${espacoId}`,
        });
      }
    }

    // Se estamos em /kanban/espaco/[espacoId]/quadro/[quadroId]
    if (router.pathname.includes('/quadro/')) {
      const espacoId = router.query.espacoId;
      const quadroId = router.query.quadroId;

      // Adicionar espaço (sempre presente quando estamos em um quadro)
      if (espacoId && typeof espacoId === 'string') {
        items.push({
          label: 'Quadros',
          href: `/kanban/espaco/${espacoId}`,
        });
      }

      // Adicionar quadro
      if (quadroId && typeof quadroId === 'string') {
        items.push({
          label: 'Quadro',
          href: undefined, // Último item não é clicável
        });
      }
    }

    return items;
  };

  const handleBreadcrumbClick = (href?: string) => {
    if (href && href !== router.asPath) {
      router.push(href);
    }
  };

  const items = breadcrumbs();

  if (items.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-white rounded-xl px-4 py-2 mb-2">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isClickable = item.href && !isLast;

        return (
          <div key={index} className="flex items-center cursor-pointer">
            {isClickable ? (
              <button
                onClick={() => handleBreadcrumbClick(item.href)}
                className="hover:text-gray-900 transition-colors"
              >
                {item.label}
              </button>
            ) : (
              <span className={isLast ? 'font-semibold border-b border-white text-white ' : ''}>
                {item.label}
              </span>
            )}
            {!isLast && <span className="mx-2 text-white">/</span>}
          </div>
        );
      })}
    </nav>
  );
};
