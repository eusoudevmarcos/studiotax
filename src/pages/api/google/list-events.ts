import { google } from 'googleapis';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const token = await getToken({ req });
    if (!token?.access_token) {
      return res
        .status(401)
        .json({ message: 'Usuário não autenticado no Google.' });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token.sub });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const now = new Date();

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      maxResults: 20,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return res.status(200).json(response.data.items || []);
  } catch (error: any) {
    console.log('Erro ao listar eventos:', error);
    return res.status(500).json({ message: error.message });
  }
}
