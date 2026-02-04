import { useAdmin } from '@/context/AuthContext';

export function AdminGuard({
  children,
  typeText = false,
}: {
  children: React.ReactNode;
  typeText?: boolean;
}) {
  const isAdmin = useAdmin();

  if (!isAdmin) {
    if (typeText) {
      return '*******';
    }

    return <></>;
  }

  return children;
}
