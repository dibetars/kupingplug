import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

type ArtistLink = {
  Name: string;
  link: string;
};

type MusicItem = {
  name: string;
  link: string;
  image: {
    url: string;
    meta: { width: number; height: number };
  };
};

type Artist = {
  id: string;
  ArtistName: string;
  bioM: string;
  Photo: {
    url: string;
    meta: { width: number; height: number };
  };
  links: ArtistLink[] | null;
  music: MusicItem[];
};

async function readAll(): Promise<Artist[]> {
  const filePath = path.join(process.cwd(), 'data', 'idrcrds.json');
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
}

async function writeAll(artists: Artist[]) {
  const filePath = path.join(process.cwd(), 'data', 'idrcrds.json');
  await fs.writeFile(filePath, JSON.stringify(artists, null, 2), 'utf8');
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const artists = await readAll();
    const artist = artists.find((a) => a.id === params.id);
    if (!artist) return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    return NextResponse.json(artist);
  } catch {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const artists = await readAll();
    const idx = artists.findIndex((a) => a.id === params.id);
    if (idx === -1) return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    const updated: Artist = { ...artists[idx], ...body };
    artists[idx] = updated;
    await writeAll(artists);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const artists = await readAll();
    const idx = artists.findIndex((a) => a.id === params.id);
    if (idx === -1) return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    const next = artists.filter((a) => a.id !== params.id);
    await writeAll(next);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}