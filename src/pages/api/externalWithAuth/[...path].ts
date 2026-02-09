// pages/api/externalWithAuth/[...path].ts (Ajuste AQUI)
import axios from 'axios';
import { parse } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

const externalBackendApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  maxContentLength: 50 * 1024 * 1024, // 50MB
  maxBodyLength: 50 * 1024 * 1024, // 50MB
});

// Configurar para aceitar body grande (desabilitar body parser padrão)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
    const token = cookies.token;

    if (!token) {
      return res.status(401).json({ error: 'Não autenticado.' });
    }

    const { path } = req.query;
    const externalPath = Array.isArray(path) ? path.join('/') : path;

    const urlToExternalBackend = `/${externalPath}`;

    // if (process.env.NODE_ENV === 'production') {
    //   if (req.method === 'GET') {
    //     const data = await redis.get(cacheKey);

    //     if (data) {
    //       return res.status(200).json({ cached: true, ...data });
    //     }
    //   }
    // }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    let externalResponse;
    switch (req.method) {
      case 'GET':
        externalResponse = await externalBackendApi.get(urlToExternalBackend, {
          headers,
          params: req.query,
        });
        break;
      case 'POST':
        externalResponse = await externalBackendApi.post(
          urlToExternalBackend,
          req.body,
          { headers }
        );
        // if (externalPath) await invalidateGetCache(externalPath);
        break;
      case 'PUT':
        externalResponse = await externalBackendApi.put(
          urlToExternalBackend,
          req.body,
          {
            headers,
            params: req.query,
          }
        );
        // if (externalPath) await invalidateGetCache(externalPath);
        break;
      case 'PATCH':
        externalResponse = await externalBackendApi.patch(
          urlToExternalBackend,
          req.body,
          { headers }
        );
        // if (externalPath) await invalidateGetCache(externalPath);
        break;
      case 'DELETE':
        externalResponse = await externalBackendApi.delete(
          urlToExternalBackend,
          { headers, data: req.body }
        );
        // if (externalPath) await invalidateGetCache(externalPath);
        break;
      default:
        return res
          .status(405)
          .json({ error: 'Método não permitido nesta rota de proxy.' });
    }

    // if (process.env.NODE_ENV === 'production') {
    //   if (externalResponse?.data) {
    //     await redis.set(cacheKey, externalResponse?.data, { ex: 300 });
    //   }
    // }

    res.status(externalResponse.status).json(externalResponse.data);
  } catch (error: any) {
    console.log(error);
    const statusCode = error.response?.status || 500;
    res.status(statusCode).json({
      error: 'Erro ao se comunicar com a API externa.',
      details: error.response?.data || error.message,
    });
  }
}
