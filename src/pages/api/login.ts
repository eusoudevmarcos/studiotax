/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/login.ts
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

function getExternalLoginUrl() {
  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const apiUrl = rawApiUrl
    .trim()
    .replace(/\\r/g, '')
    .replace(/\\n/g, '')
    .replace(/\r/g, '')
    .replace(/\n/g, '');

  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL nao esta configurada.');
  }

  const baseUrl = new URL(apiUrl);

  if (process.env.NODE_ENV === 'production' && baseUrl.hostname === 'localhost') {
    throw new Error('NEXT_PUBLIC_API_URL esta apontando para localhost em producao.');
  }

  return new URL('/api/auth/login', baseUrl).toString();
}

function normalizeAuthCookie(cookie: string) {
  const parts = cookie
    .split(';')
    .map(part => part.trim())
    .filter(Boolean);

  const [nameValue, ...attributes] = parts;
  const filteredAttributes = attributes.filter(
    attribute =>
      !/^domain=/i.test(attribute) &&
      !/^path=/i.test(attribute) &&
      !/^samesite=/i.test(attribute) &&
      !/^secure$/i.test(attribute)
  );

  const hasHttpOnly = filteredAttributes.some(attribute =>
    /^httponly$/i.test(attribute)
  );

  return [
    nameValue,
    'Path=/',
    ...filteredAttributes,
    hasHttpOnly ? null : 'HttpOnly',
    process.env.NODE_ENV === 'production' ? 'Secure' : null,
    'SameSite=Lax',
  ]
    .filter(Boolean)
    .join('; ');
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const { username, password } = req.body;

  try {
    const response = await axios.post(getExternalLoginUrl(), {
      username,
      password,
    });

    const { uid } = response.data;

    const setCookieHeader = response.headers['set-cookie'];

    if (setCookieHeader) {
      const cookies = Array.isArray(setCookieHeader)
        ? setCookieHeader
        : [setCookieHeader];
      res.setHeader('Set-Cookie', cookies.map(normalizeAuthCookie));
    } else {
      console.warn(
        "Backend externo não retornou o cabeçalho 'Set-Cookie' com o token."
      );
    }

    res.status(200).json({ uid });
  } catch (err: any) {
    console.error('Erro no login:', err?.message);
    res.status(err?.response?.status || 500).json({
      error: err?.response?.data?.error || 'Erro desconhecido no login.',
      details: err?.response?.data || err?.message,
    });
  }
}
