/* eslint-disable @typescript-eslint/no-explicit-any */
// src/context/SearchTakeitContext.tsx
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

// Simplificando o tipo para apenas o que é necessário para a pesquisa
type TypeColumns = 'persons' | 'companies';

interface SearchParams {
  input: string;
  uf: string;
  options: any; // Mantenha isso como 'any' se o tipo for complexo ou desconhecido
  descriptionData: string;
  typeColumns?: TypeColumns;
}

interface SimplifiedSearchState {
  searchTerm: string;
  lastSearchParams?: SearchParams;
}

interface SearchContextType extends SimplifiedSearchState {
  setSearchData: (data: Partial<SimplifiedSearchState>) => void;
  clearSearch: () => void;
}

const STORAGE_KEY = 'takeit_last_search_params';

// Funções utilitárias para localStorage
const loadSavedState = (): SimplifiedSearchState => {
  if (typeof window !== 'undefined') {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        return JSON.parse(savedData) as SimplifiedSearchState;
      }
    } catch (e) {
      console.log('Erro ao carregar dados do localStorage:', e);
    }
  }

  // Estado inicial padrão
  return {
    searchTerm: '',
    lastSearchParams: undefined,
  };
};

// --- Contexto e Provider ---

export const SearchContext = createContext<SearchContextType | undefined>(
  undefined
);

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [state, setState] = useState<SimplifiedSearchState>(loadSavedState);

  // Efeito para salvar o estado sempre que ele mudar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state.searchTerm, state.lastSearchParams, state]);

  const setSearchData = (data: Partial<SimplifiedSearchState>) => {
    setState(prevState => ({
      ...prevState,
      ...data,
    }));
  };

  const clearSearch = () => {
    setState({
      searchTerm: '',
      lastSearchParams: undefined,
    });
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <SearchContext.Provider
      value={{
        ...state,
        setSearchData,
        clearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
};
