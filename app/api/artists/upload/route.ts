import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

function sanitizeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

function sanitizeFolder(folder: string) {
  return folder.replace(/[^a-zA-Z0-9_-]/g, '_');
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get('file') as File | null;
    const folderRaw = (form.get('folder') as string) || (form.get('artist') as string) || '';
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
    if (!folderRaw) return NextResponse.json({ error: 'folder required' }, { status: 400 });

    const buf = Buffer.from(await file.arrayBuffer());
    const filenameRaw = (form.get('filename') as string) || file.name || `upload-${Date.now()}`;
    const safeFolder = sanitizeFolder(folderRaw.trim());
    const safeName = sanitizeName(filenameRaw.trim());

    const targetDir = path.join(process.cwd(), 'public', 'artists', safeFolder);
    await fs.mkdir(targetDir, { recursive: true });
    const targetPath = path.join(targetDir, safeName);
    await fs.writeFile(targetPath, buf);

    const url = `/artists/${encodeURIComponent(safeFolder)}/${encodeURIComponent(safeName)}`;
    return NextResponse.json({ ok: true, url });
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}