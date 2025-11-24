import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { generateSlug } from '@/lib/utils';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'idrcrds.json');
    const data = await fs.readFile(filePath, 'utf8');
    return Response.json(JSON.parse(data));
  } catch {
    return Response.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'idrcrds.json');
    const data = await fs.readFile(filePath, 'utf8');
    const artists = JSON.parse(data) as any[];
    const body = await request.json();
    const name = String(body.ArtistName || '').trim();
    if (!name) return NextResponse.json({ error: 'ArtistName required' }, { status: 400 });
    const id = body.id ? String(body.id) : generateSlug(name);
    if (artists.find((a) => a.id === id)) {
      return NextResponse.json({ error: 'Artist already exists' }, { status: 409 });
    }
    const photo = body.Photo && body.Photo.url ? body.Photo : { url: '', meta: { width: 1200, height: 800 } };
    const links = Array.isArray(body.links) ? body.links : [];
    const music = Array.isArray(body.music) ? body.music : [];
    const created = {
      id,
      ArtistName: name,
      bioM: String(body.bioM || ''),
      Photo: photo,
      links,
      music,
    };
    artists.push(created);
    await fs.writeFile(filePath, JSON.stringify(artists, null, 2), 'utf8');
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}