// pages/api/externalWithAuth/[...path].ts (Ajuste AQUI)
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const externalBackendApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
    // const token = cookies.token;

    // if (!token) {
    //   return res.status(401).json({ error: 'Não autenticado.' });
    // }

    const { path } = req.query;
    const externalPath = Array.isArray(path) ? path.join('/') : path;

    const urlToExternalBackend = `/${externalPath}`;
    const reset = '\x1b[0m';
    const green = '\x1b[32m';
    console.log(
      `${green}${process.env.NEXT_PUBLIC_API_URL}/api${urlToExternalBackend}${reset}`
    );

    let externalResponse;
    switch (req.method) {
      case 'GET':
        externalResponse = await externalBackendApi.get(urlToExternalBackend, {
          params: req.query,
        });
        break;
      case 'POST':
        externalResponse = await externalBackendApi.post(
          urlToExternalBackend,
          req.body
        );
        break;
      case 'PUT':
        externalResponse = await externalBackendApi.put(
          urlToExternalBackend,
          req.body
        );
        break;
      case 'DELETE':
        externalResponse = await externalBackendApi.delete(
          urlToExternalBackend,
          { data: req.body }
        );
        break;
      default:
        return res
          .status(405)
          .json({ error: 'Método não permitido nesta rota de proxy.' });
    }

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
