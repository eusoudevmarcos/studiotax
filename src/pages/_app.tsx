// frontend/pages/_app.tsx
import DashboardLayout from "@/layouts/DashboardLayout";
import KanbanLayout from "@/layouts/KanbanLayout";
import MainLayout from "@/layouts/MainLayout";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";

import { AuthProvider } from "@/context/AuthContext";
import { isAlwaysPublicPath } from "@/proxy";
import "@/styles/globals.css";
import "@/styles/landingPage.css";
// import { GoogleAnalytics } from '@next/third-parties/google';
import { useEffect, useState } from "react";

const PUBLIC_ROUTES = ["/login"];

// Componente de isolamento do loading
type LoadingWrapperProps = {
  children: React.ReactNode;
};
function LoadingWrapper({ children }: LoadingWrapperProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const start = () => setLoading(true);
    const complete = () => setLoading(false);
    const error = () => setLoading(false);

    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", complete);
    router.events.on("routeChangeError", error);

    setLoading(false);

    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", complete);
      router.events.off("routeChangeError", error);
    };
  }, [router.events]);

  // useEffect(() => {
  //   const handleRouteChange = (url: string) => {
  //     window.gtag("config", process.env.NEXT_PUBLIC_GA_ID!, {
  //       page_path: url,
  //     });
  //   };

  //   router.events.on("routeChangeComplete", handleRouteChange);
  //   return () => {
  //     router.events.off("routeChangeComplete", handleRouteChange);
  //   };
  // }, [router.events]);

  if (loading) {
    return (
      <div className="fixed left-0 right-0 flex flex-col justify-center items-center w-full h-32">
        <div
          className="border-4 border-primary border-t-transparent rounded-full w-12 h-12 animate-spin"
          style={{
            borderTopColor: "transparent",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <span className="mt-2 text-primary">Carregando...</span>
        <style jsx global>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
}

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isPublic = PUBLIC_ROUTES.includes(router.pathname);

  // const GoogleAnalyticsId = () => <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />

  if (router.pathname == "/dashboard/cliente") {
    return (
      <>
        <AuthProvider>
          {/* <SpeedInsights /> */}
          <DashboardLayout>
            <LoadingWrapper>
              <Component {...pageProps} />
            </LoadingWrapper>
          </DashboardLayout>
        </AuthProvider>
        {/* <GoogleAnalyticsId /> */}
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Studio TAX</title>
        <link rel="icon" href="/logo_simbolo.ico" />
        <meta
          name="description"
          content="Studio TAX: Soluções em tributação, análise fiscal e CRM completo para sua empresa. Gestão inteligente, consultoria tributária e automação de processos fiscais."
        />
      </Head>

      {router.pathname === "/" ? (
        <>
          <MainLayout>
            <LoadingWrapper>
              <Component {...pageProps} />
            </LoadingWrapper>
          </MainLayout>
        </>
      ) : isPublic || isAlwaysPublicPath(router.pathname) ? (
        <>
          <LoadingWrapper>
            <Component {...pageProps} />
          </LoadingWrapper>
        </>
      ) : (
        <AuthProvider>
          {router.pathname.startsWith("/kanban") ? (
            <KanbanLayout>
              <LoadingWrapper>
                <Component {...pageProps} />
              </LoadingWrapper>
            </KanbanLayout>
          ) : (
            <DashboardLayout>
              {(dashboardProps) => (
                <LoadingWrapper>
                  <Component {...pageProps} {...dashboardProps} />
                </LoadingWrapper>
              )}
            </DashboardLayout>
          )}
        </AuthProvider>
      )}

      {/* <GoogleAnalyticsId /> */}
    </>
  );
}

export default App;
