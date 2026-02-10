/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSession } from 'next-auth/react';

export default async function getAvailableTimes(date: string) {
  const session = await getSession();
  // Some session objects may not contain accessToken directly. Use 'any' for safe extraction.
  const accessToken = (session as any)?.accessToken;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`/api/google/available-times?date=${date}`, {
    method: 'GET',
    credentials: 'same-origin',
    headers,
  });

  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(err.message || 'Erro ao buscar horários disponíveis');
  }

  return await res.json();
}
