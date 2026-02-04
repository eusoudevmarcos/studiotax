import { google } from 'googleapis';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET as string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST')
    return res.status(405).json({ message: 'Método não permitido.' });

  // DEBUG: log dos cookies/header (remova em produção)
  console.log('req.headers.cookie:', req.headers.cookie);
  console.log('req.headers.authorization:', req.headers.authorization);

  // 1) tenta recuperar token do cookie JWT do NextAuth
  const token = await getToken({ req, secret });

  // 2) se não tiver token, tenta pegar do header Authorization
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const bearerToken =
    typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

  if (!token && !bearerToken) {
    return res
      .status(401)
      .json({ message: 'Não autenticado ou token inválido.' });
  }

  try {
    const { summary, description, start, end, location, attendees, meetLink } =
      req.body;

    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.NEXTAUTH_URL + '/api/auth/callback/google'
    );

    // Se token do NextAuth existir, usa-o (e refresh token, se disponível)
    if (token && token.accessToken) {
      oAuth2Client.setCredentials({
        access_token: token.accessToken as string,
        refresh_token: token.refreshToken as string | undefined,
      });
    } else if (bearerToken) {
      // Fallback: usar o access token que veio no header Authorization
      oAuth2Client.setCredentials({ access_token: bearerToken });
    }

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    // montar evento (igual ao seu)
    const event: any = {
      summary,
      description,
      location,
      start: {
        dateTime: new Date(start).toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: new Date(end).toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
      attendees: attendees?.map((email: string) => ({ email })) || [],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 1440 },
          { method: 'popup', minutes: 30 },
        ],
      },
    };

    if (meetLink || !location) {
      event.conferenceData = {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      };
    }

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      conferenceDataVersion: meetLink || !location ? 1 : 0,
      sendUpdates: 'all',
    });

    res.status(200).json({
      message: 'Evento criado com sucesso!',
      event: response.data,
      meetLink:
        response.data.hangoutLink ||
        response.data.conferenceData?.entryPoints?.[0]?.uri,
    });
  } catch (error: any) {
    console.log('Erro ao criar evento:', error);
    if (error.code === 401 || error.message?.includes('invalid_grant')) {
      return res.status(401).json({
        message: 'Token expirado. Faça login novamente.',
        error: 'TOKEN_EXPIRED',
      });
    }
    res.status(500).json({
      message: 'Erro interno ao criar o evento.',
      error: error.message,
    });
  }
}
