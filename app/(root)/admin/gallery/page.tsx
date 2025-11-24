'use client';

import React from 'react';
import Image from 'next/image';

export default function AdminGalleryPage() {
  const [images, setImages] = React.useState<{ url: string }[]>([]);
  const [videos, setVideos] = React.useState<{ url: string }[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [uploading, setUploading] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gallery/list', { cache: 'no-store' });
      const data = await res.json();
      setImages(data.images || []);
      setVideos(data.videos || []);
    } catch (e) {
      setError('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const onUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setUploading(true);
    setError(null);
    try {
      const res = await fetch('/api/gallery/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Upload failed');
      await load();
      form.reset();
    } catch (e) {
      setError('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Gallery</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="space-y-12">
              <div>
                <h2 className="text-xl font-semibold mb-4">Upload</h2>
                <form className="flex flex-col gap-4" onSubmit={onUpload}>
                  <div className="flex gap-4">
                    <select name="kind" className="rounded-md border-gray-300 shadow-sm">
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                    <input name="filename" type="text" placeholder="Filename (optional)" className="flex-1 rounded-md border-gray-300 shadow-sm" />
                    <input name="file" type="file" required className="rounded-md border-gray-300 shadow-sm" />
                    <button type="submit" disabled={uploading} className="bg-[#ffc95c] hover:bg-[#ffc95c]/90 text-black py-2 px-4 rounded-md shadow-sm text-sm font-medium disabled:opacity-50">
                      {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                  {error && <p className="text-red-600 text-sm">{error}</p>}
                </form>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Images</h2>
                {images.length === 0 ? (
                  <p className="text-gray-600">No images.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {images.map((img) => (
                      <div key={img.url} className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                        <Image src={img.url} alt="" fill className="object-cover object-center" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Videos</h2>
                {videos.length === 0 ? (
                  <p className="text-gray-600">No videos.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {videos.map((vid) => (
                      <div key={vid.url} className="relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-black">
                        <video src={vid.url} controls className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}