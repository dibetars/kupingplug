import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const imgDir = path.join(process.cwd(), 'public', 'artists', 'gallery', 'images');
    const vidDir = path.join(process.cwd(), 'public', 'artists', 'gallery', 'videos');
    const [images, videos] = await Promise.all([
      fs.readdir(imgDir).catch(() => []),
      fs.readdir(vidDir).catch(() => []),
    ]);
    const imageItems = images.map((f) => ({ url: `/artists/gallery/images/${encodeURIComponent(f)}` }));
    const videoItems = videos.map((f) => ({ url: `/artists/gallery/videos/${encodeURIComponent(f)}` }));
    return Response.json({ images: imageItems, videos: videoItems });
  } catch {
    return Response.json({ images: [], videos: [] });
  }
}