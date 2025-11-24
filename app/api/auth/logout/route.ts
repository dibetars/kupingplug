import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = cookies();
  cookieStore.set('idr_admin', '', { path: '/', maxAge: 0 });
  return Response.json({ ok: true });
}