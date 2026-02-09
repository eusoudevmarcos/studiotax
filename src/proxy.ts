// middleware.ts
import { verify } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

// Tipos de usuário que devem ir para /dashboard/cliente
const CLIENTE_TYPES = ['CLIENTE_ATS', 'CLIENTE_ATS_CRM', 'CLIENTE_CRM'];

// A rota "/" deve ser sempre pública (landing page), independente do login
const ALWAYS_PUBLIC_PATHS = [
  '/',
  '/planos/medicos',
  '/api/external/ping' /*, '/vaga'*/,
];

// Apenas rotas de login podem ser acessadas sem autenticação
const LOGIN_PATHS = ['/login', '/api/login'];

// Rotas específicas para cada tipo de usuário
const CLIENT_DASHBOARD_PATH = '/dashboard/cliente';
const DEFAULT_DASHBOARD_PATH = '/atividades/agendas';

// Rotas que são exclusivas para clientes
const CLIENT_ONLY_PATHS = ['/dashboard/cliente'];

// Rotas que clientes NÃO podem acessar
const NON_CLIENT_PATHS = ['/atividades', '/admin', '/configuracoes/sistema'];

export function isAlwaysPublicPath(pathname: string) {
  return ALWAYS_PUBLIC_PATHS.some(
    publicPath =>
      pathname === publicPath || pathname.startsWith(`${publicPath}/`)
  );
}
function isLoginPath(pathname: string) {
  return LOGIN_PATHS.some(loginPath => pathname.startsWith(loginPath));
}

function isClientOnlyPath(pathname: string) {
  return CLIENT_ONLY_PATHS.some(clientPath => pathname.startsWith(clientPath));
}

function isNonClientPath(pathname: string) {
  return NON_CLIENT_PATHS.some(nonClientPath =>
    pathname.startsWith(nonClientPath)
  );
}

function isClientType(userType: string) {
  return CLIENTE_TYPES.includes(userType);
}

async function getUserFromToken(token: string) {
  try {
    // Substitua 'your-secret-key' pela sua chave secreta
    const secret = process.env.NUXT_PUBLIC_JWT_SECRET!;
    // O método verify pode retornar string | JwtPayload
    const decoded = verify(token, secret);
    // O payload, pelo padrão da lib, é o próprio objeto retornado (JwtPayload)
    if (typeof decoded === 'object' && decoded !== null) {
      return {
        id: decoded.id as string,
        tipo: decoded.tipo as string,
        nome: decoded.nome as string,
        // Adicione outros campos que você tem no JWT
      };
    }
    return null;
  } catch (error) {
    console.log('Erro ao verificar token:', error);
    return null;
  }
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Acesso sempre liberado para a landing page "/"
  if (isAlwaysPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get('token')?.value;

  // Se não estiver autenticado
  if (!token) {
    // Permite acesso apenas às rotas de login e à landing page
    if (isLoginPath(pathname)) {
      return NextResponse.next();
    }

    // Bloqueia acesso a qualquer outra rota (exceto API)
    if (!pathname.startsWith('/api')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Para rotas de API protegidas
    return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });
  }

  // Tenta obter dados do usuário do token
  const user = await getUserFromToken(token);

  // Se o token é inválido
  if (!user) {
    // Remove o cookie inválido e redireciona para login
    const response = NextResponse.redirect(
      new URL('/login?error=invalid_token', req.url)
    );
    response.cookies.delete('token');
    return response;
  }

  // Se estiver nas rotas de login já autenticado
  if (isLoginPath(pathname)) {
    if (!pathname.startsWith('/api')) {
      // Redireciona baseado no tipo de usuário
      const dashboardPath = isClientType(user.tipo)
        ? CLIENT_DASHBOARD_PATH
        : DEFAULT_DASHBOARD_PATH;
      return NextResponse.redirect(new URL(dashboardPath, req.url));
    }
    return NextResponse.next();
  }

  // VALIDAÇÕES BASEADAS NO TIPO DE USUÁRIO

  // Se for cliente (ATS, CRM, ATS_CRM)
  if (isClientType(user.tipo)) {
    // Clientes tentando acessar rotas proibidas
    if (isNonClientPath(pathname)) {
      return NextResponse.redirect(
        new URL(`${CLIENT_DASHBOARD_PATH}`, req.url)
      );
    }

    // Redireciona clientes para seu dashboard se acessarem o dashboard padrão
    if (
      pathname === DEFAULT_DASHBOARD_PATH ||
      pathname.startsWith('/atividades')
    ) {
      return NextResponse.redirect(new URL(CLIENT_DASHBOARD_PATH, req.url));
    }
  }
  // Se NÃO for cliente
  else {
    // Usuários não-clientes tentando acessar rotas de cliente
    if (isClientOnlyPath(pathname)) {
      return NextResponse.redirect(
        new URL(`${DEFAULT_DASHBOARD_PATH}?error=client_only`, req.url)
      );
    }
  }

  // Permite acesso normal para usuários autenticados e autorizados
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|_next/data|favicon.ico|robots.txt|logo.png|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.woff$|.*\\.woff2$|.*\\.ttf$|.*\\.eot$).*)',
  ],
};
