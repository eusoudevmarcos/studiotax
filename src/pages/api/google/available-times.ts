import { google } from 'googleapis';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET')
    return res.status(405).json({ message: 'Método não permitido' });

  try {
    // 🟡 1) tenta recuperar token do cookie (JWT NextAuth)
    const token = await getToken({ req, secret });

    // 🟡 2) tenta recuperar token do header Authorization
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const bearerToken =
      typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null;

    const accessToken = token?.accessToken || bearerToken;

    if (!accessToken) {
      return res
        .status(401)
        .json({ message: 'Não autenticado ou token inválido.' });
    }

    // 🗓️ Pega a data via query param
    const { date } = req.query;
    if (!date)
      return res
        .status(400)
        .json({ message: 'Parâmetro "date" é obrigatório (YYYY-MM-DD)' });

    const startOfDay = new Date(`${date}T00:00:00-03:00`).toISOString();
    const endOfDay = new Date(`${date}T23:59:59-03:00`).toISOString();

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: 'v3', auth });

    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: startOfDay,
        timeMax: endOfDay,
        timeZone: 'America/Sao_Paulo',
        items: [{ id: 'primary' }],
      },
    });

    const busy = response.data.calendars?.primary?.busy || [];

    const startHour = 8;
    const endHour = 18;
    const available: string[] = [];

    for (let h = startHour; h < endHour; h++) {
      const slotStart = new Date(
        `${date}T${String(h).padStart(2, '0')}:00:00-03:00`
      );
      const slotEnd = new Date(
        `${date}T${String(h + 1).padStart(2, '0')}:00:00-03:00`
      );

      const isBusy = busy.some(
        b =>
          new Date(b.start as string) < slotEnd &&
          new Date(b.end as string) > slotStart
      );

      if (!isBusy) available.push(`${String(h).padStart(2, '0')}:00`);
    }

    return res.status(200).json({ date, available });
  } catch (err: any) {
    console.log('Erro ao buscar horários:', err);
    return res.status(500).json({
      message: 'Erro ao consultar horários disponíveis.',
      details: err.message,
    });
  }
}
