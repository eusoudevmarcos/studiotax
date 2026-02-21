import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

const SessionProvider = dynamic(
  () =>
    import('next-auth/react').then((mod) => ({ default: mod.SessionProvider })),
  { ssr: false }
);

interface SessionProviderWrapperProps {
  children: ReactNode;
}

export const SessionProviderWrapper: React.FC<SessionProviderWrapperProps> = ({
  children,
}) => {
  return <SessionProvider>{children}</SessionProvider>;
};
