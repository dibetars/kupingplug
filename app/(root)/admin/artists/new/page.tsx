'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { generateSlug } from '@/lib/utils';

export default function NewArtistPage() {
  const router = useRouter();
  const [name, setName] = React.useState('');
  const [bio, setBio] = React.useState('');
  const [photoUrl, setPhotoUrl] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        id: generateSlug(name),
        ArtistName: name,
        bioM: bio,
        Photo: { url: photoUrl, meta: { width: 1200, height: 800 } },
        links: [],
        music: [],
      };
      const res = await fetch('/api/idrcrds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create artist');
      router.push('/admin/artists');
    } catch (e) {
      alert('Failed to create artist');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Artist</h1>
          <Link href="/admin/artists" className="text-gray-600 hover:text-gray-900">Back to Artists</Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <label htmlFor="artist-name" className="block text-sm font-medium text-gray-700">Artist Name</label>
              <input
                id="artist-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ffc95c] focus:ring-[#ffc95c] sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="artist-bio" className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                id="artist-bio"
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ffc95c] focus:ring-[#ffc95c] sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="artist-photo-url" className="block text-sm font-medium text-gray-700">Photo URL</label>
              <input
                id="artist-photo-url"
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="/artists/midnightSuns/midnightSunsArtwork.png"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ffc95c] focus:ring-[#ffc95c] sm:text-sm"
              />
            </div>

            <div className="flex justify-end gap-4">
              <Link href="/admin/artists" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</Link>
              <button type="submit" disabled={saving} className="bg-[#ffc95c] hover:bg-[#ffc95c]/90 text-black py-2 px-4 rounded-md shadow-sm text-sm font-medium disabled:opacity-50">
                {saving ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}