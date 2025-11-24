import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = String(body.username || '').trim();
    const password = String(body.password || '').trim();
    const envUser = process.env.ADMIN_USER || 'admin';
    const envPass = process.env.ADMIN_PASSWORD || '';
    if (!envPass) {
      return Response.json({ error: 'Admin password not configured' }, { status: 500 });
    }
    if (username !== envUser || password !== envPass) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    const cookieStore = cookies();
    cookieStore.set('idr_admin', '1', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 8,
    });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 });
  }
}