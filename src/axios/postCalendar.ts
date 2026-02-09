import { getSession } from 'next-auth/react';

export default async function postCalendar(rest: any) {
  const session = await getSession();
  const accessToken = session?.accessToken;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const res = await fetch('/api/google/create-event', {
    method: 'POST',
    credentials: 'same-origin',
    headers,
    body: JSON.stringify({
      summary: `${String(rest.tipoEvento).replace(/[^a-zA-Z ]/g, '')} ${
        rest.titulo
      }`,
      organizer: {
        email: 'aurareslabs@gmail.com',
        displayName: 'Equipe AURA R&L ATS',
      },
      description: 'Reunião criada via AURA ATS',
      start: rest.dataHora,
      end: new Date(
        new Date(rest.dataHora).getTime() + 60 * 60 * 1000
      ).toISOString(),
      location:
        rest.selectLocalizacao === 'PRESENCIAL'
          ? rest.localizacao?.endereco
          : undefined,
      attendees: rest.convidados || [],
      meetLink: rest.selectLocalizacao === 'REMOTO' ? rest.link : undefined,
    }),
  });

  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(err.message || 'Erro ao criar evento');
  }

  return await res.json();
}
