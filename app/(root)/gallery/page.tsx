import fs from 'fs/promises';
import path from 'path';
import Image from 'next/image';

type GalleryImage = { url: string; alt: string };
type GalleryVideo = { url: string; type: string };

async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const dir = path.join(process.cwd(), 'public', 'artists', 'gallery', 'images');
    const entries = await fs.readdir(dir);
    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return entries
      .filter((f) => allowed.some((ext) => f.toLowerCase().endsWith(ext)))
      .map((f) => ({
        url: `/artists/gallery/images/${encodeURIComponent(f)}`,
        alt: f.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      }));
  } catch {
    return [];
  }
}

async function getGalleryVideos(): Promise<GalleryVideo[]> {
  try {
    const dir = path.join(process.cwd(), 'public', 'artists', 'gallery', 'videos');
    const entries = await fs.readdir(dir);
    const allowed = ['.mp4', '.webm', '.mov', '.m4v'];
    return entries
      .filter((f) => allowed.some((ext) => f.toLowerCase().endsWith(ext)))
      .map((f) => {
        const lower = f.toLowerCase();
        let type = 'video/mp4';
        if (lower.endsWith('.webm')) type = 'video/webm';
        else if (lower.endsWith('.mov')) type = 'video/quicktime';
        else if (lower.endsWith('.m4v')) type = 'video/mp4';
        return {
          url: `/artists/gallery/videos/${encodeURIComponent(f)}`,
          type,
        };
      });
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const images = await getGalleryImages();
  const videos = await getGalleryVideos();

  return (
    <div className="min-h-full bg-white">
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-10">Gallery</h1>

            {images.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Images</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {images.map((img) => (
                    <div key={img.url} className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                      <Image src={img.url} alt={img.alt} fill className="object-cover object-top" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {videos.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-semibold mb-6">Videos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {videos.map((vid) => (
                    <div key={vid.url} className="relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-black">
                      <video src={vid.url} controls className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {images.length === 0 && videos.length === 0 && (
              <p className="text-gray-600">No gallery items available yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}