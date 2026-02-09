import { SearchProvider } from '@/context/SearchTakeitContext';

interface Props {
  children: React.ReactNode;
}

export default function TakeitLayout({ children }: Props) {
  return (
    <SearchProvider>
      <section className="flex flex-col bg-white max-w-7xl rounded-2xl mx-auto shadow-md">
        <h1 className="w-full text-center text-primary font-black text-4xl my-4">
          TAKE IT
        </h1>

        {children}
      </section>
    </SearchProvider>
  );
}
