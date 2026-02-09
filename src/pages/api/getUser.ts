import { NextApiRequest, NextApiResponse } from "next";
import { verify } from "jsonwebtoken";
import { parse } from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
    const token = cookies.token;

    if (!token) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    const user = verify(token, process.env.NUXT_PUBLIC_JWT_SECRET || "") as Record<string, unknown>;
    return res.status(200).json({ user });
  } catch (_) {
    return res.status(401).json({ error: "Token inválido" });
  }
}
