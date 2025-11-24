'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { generateSlug } from '@/lib/utils';

interface ArtistLink {
  Name: string;
  link: string;
}

interface MusicItem {
  name: string;
  link: string;
  image: {
    url: string;
    meta: {
      width: number;
      height: number;
    };
  };
}

interface Artist {
  id: string;
  ArtistName: string;
  bioM: string;
  Photo: {
    url: string;
    meta: {
      width: number;
      height: number;
    };
  };
  links: ArtistLink[] | null;
  music: MusicItem[];
}

export default function EditArtistPage({
  params
}: {
  params: { id: string }
}) {
  const router = useRouter();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [links, setLinks] = useState<ArtistLink[]>([]);
  const [music, setMusic] = useState<MusicItem[]>([]);

  React.useEffect(() => {
    const fetchArtist = async () => {
      try {
        const res = await fetch(`/api/idrcrds/${params.id}`);
        if (!res.ok) throw new Error('Failed to fetch artist');
        const data = await res.json();
        setArtist(data);
        setName(data.ArtistName || '');
        setBio(data.bioM || '');
        setPhotoUrl(data.Photo?.url || '');
        setLinks(Array.isArray(data.links) ? data.links : []);
        setMusic(Array.isArray(data.music) ? data.music : []);
      } catch (error) {}
    };

    fetchArtist();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const updatedArtist = {
      id: params.id,
      ArtistName: name,
      bioM: bio,
      Photo: {
        url: photoUrl || artist?.Photo?.url || '',
        meta: artist?.Photo?.meta || { width: 1200, height: 800 },
      },
      links,
      music,
    };

    try {
      const res = await fetch(`/api/idrcrds/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedArtist),
      });
      if (!res.ok) throw new Error('Failed to update artist');
      router.push('/admin/artists');
    } catch (error) {
      alert('Failed to update artist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const addLink = () => setLinks([...links, { Name: '', link: '' }]);
  const updateLink = (idx: number, key: keyof ArtistLink, val: string) => {
    const next = [...links];
    (next[idx] as any)[key] = val;
    setLinks(next);
  };
  const removeLink = (idx: number) => setLinks(links.filter((_, i) => i !== idx));

  const addTrack = () => setMusic([...music, { name: '', link: '', image: { url: '', meta: { width: 1200, height: 800 } } }]);
  const updateTrack = (idx: number, key: keyof MusicItem, val: any) => {
    const next = [...music];
    (next[idx] as any)[key] = val;
    setMusic(next);
  };
  const updateTrackImageUrl = (idx: number, val: string) => {
    const next = [...music];
    next[idx].image = { url: val, meta: next[idx].image?.meta || { width: 1200, height: 800 } };
    setMusic(next);
  };
  const removeTrack = (idx: number) => setMusic(music.filter((_, i) => i !== idx));

  const onDelete = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/idrcrds/${params.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete artist');
      router.push('/admin/artists');
    } catch (error) {
      alert('Failed to delete artist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!artist) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-full bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Artist</h1>
          <Link
            href="/admin/artists"
            className="text-gray-600 hover:text-gray-900"
          >
            Back to Artists
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Artist Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Artist Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ffc95c] focus:ring-[#ffc95c] sm:text-sm"
              />
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ffc95c] focus:ring-[#ffc95c] sm:text-sm"
              />
            </div>

            {/* Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Photo
              </label>
              <div className="mt-1 flex items-center">
                <div className="relative h-20 w-20 rounded-full overflow-hidden">
                  <Image
                    src={artist.Photo?.url || '/placeholder-artist.jpg'}
                    alt={artist.ArtistName}
                    fill
                    className="object-cover"
                  />
                </div>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="/artists/kingMidnight/kmavatar.png"
                  className="ml-5 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ffc95c] focus:ring-[#ffc95c] sm:text-sm"
                />
              </div>
            </div>

            {/* Social Links */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Social Links
              </label>
              <div className="space-y-4">
                {links.map((link, index) => (
                  <div key={index} className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Platform Name"
                      value={link.Name}
                      onChange={(e) => updateLink(index, 'Name', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ffc95c] focus:ring-[#ffc95c] sm:text-sm"
                    />
                    <input
                      type="url"
                      placeholder="Link URL"
                      value={link.link}
                      onChange={(e) => updateLink(index, 'link', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ffc95c] focus:ring-[#ffc95c] sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addLink}
                  className="text-[#ffc95c] hover:text-[#ffc95c]/80"
                >
                  + Add Link
                </button>
              </div>
            </div>

            {/* Music */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Music
              </label>
              <div className="space-y-4">
                {music.map((item, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                      <Image
                        src={item.image.url || '/placeholder-artist.jpg'}
                        alt={item.name || 'Artwork'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Track Name"
                      value={item.name}
                      onChange={(e) => updateTrack(index, 'name', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ffc95c] focus:ring-[#ffc95c] sm:text-sm"
                    />
                    <input
                      type="url"
                      placeholder="Streaming Link"
                      value={item.link}
                      onChange={(e) => updateTrack(index, 'link', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ffc95c] focus:ring-[#ffc95c] sm:text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Artwork URL"
                      value={item.image.url}
                      onChange={(e) => updateTrackImageUrl(index, e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ffc95c] focus:ring-[#ffc95c] sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeTrack(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTrack}
                  className="text-[#ffc95c] hover:text-[#ffc95c]/80"
                >
                  + Add Track
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Link
                href="/admin/artists"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffc95c]"
              >
                Cancel
              </Link>
              <button
                type="button"
                onClick={onDelete}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 disabled:opacity-50"
              >
                Delete Artist
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#ffc95c] hover:bg-[#ffc95c]/90 text-black py-2 px-4 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffc95c] disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}