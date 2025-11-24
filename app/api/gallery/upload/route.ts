import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get('file') as File | null;
    const kind = String(form.get('kind') || 'image');
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
    const buf = Buffer.from(await file.arrayBuffer());
    const safeName = (form.get('filename') as string) || file.name || `upload-${Date.now()}`;
    const targetDir = kind === 'video'
      ? path.join(process.cwd(), 'public', 'artists', 'gallery', 'videos')
      : path.join(process.cwd(), 'public', 'artists', 'gallery', 'images');
    await fs.mkdir(targetDir, { recursive: true });
    const targetPath = path.join(targetDir, safeName);
    await fs.writeFile(targetPath, buf);
    return NextResponse.json({ ok: true, url: kind === 'video' ? `/artists/gallery/videos/${encodeURIComponent(safeName)}` : `/artists/gallery/images/${encodeURIComponent(safeName)}` });
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}