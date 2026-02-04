// pages/api/logout.ts
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const externalBackendApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // timeout: 10000,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  try {
    res.setHeader('Set-Cookie', [
      'token=; Path=/; HttpOnly; Secure; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    ]);
    res.setHeader(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');

    res
      .status(200)
      .json({ success: true, message: 'Logout realizado com sucesso.' });
  } catch (err: any) {
    res.status(err?.response?.status || 500).json({
      error: err?.response?.data?.error || 'Erro desconhecido no logout.',
      details: err?.response?.data,
    });
  }
}
