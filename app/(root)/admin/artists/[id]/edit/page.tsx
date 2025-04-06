'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

  React.useEffect(() => {
    const fetchArtist = async () => {
      try {
        const res = await fetch(`https://x8ki-letl-twmt.n7.xano.io/api:TF3YOouP/idrcrds/${params.id}`);
        if (!res.ok) throw new Error('Failed to fetch artist');
        const data = await res.json();
        setArtist(data);
      } catch (error) {
        console.error('Error fetching artist:', error);
      }
    };

    fetchArtist();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const updatedArtist = {
      idrcrds_id: params.id,
      ArtistName: formData.get('name') as string,
      bioM: formData.get('bio') as string,
      Photo: artist?.Photo || null,
      links: artist?.links || [],
      music: artist?.music || []
    };

    try {
      const res = await fetch(`https://x8ki-letl-twmt.n7.xano.io/api:TF3YOouP/idrcrds/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedArtist),
      });

      if (!res.ok) throw new Error('Failed to update artist');
      
      router.push('/admin/artists');
    } catch (error) {
      console.error('Error updating artist:', error);
      alert('Failed to update artist. Please try again.');
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
                id="name"
                name="name"
                defaultValue={artist.ArtistName}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ffc95c] focus:ring-[#ffc95c] sm:text-sm"
              />
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                defaultValue={artist.bioM}
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
                <button
                  type="button"
                  className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffc95c]"
                >
                  Change
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Social Links
              </label>
              <div className="space-y-4">
                {artist.links?.map((link, index) => (
                  <div key={index} className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Platform Name"
                      defaultValue={link.Name}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ffc95c] focus:ring-[#ffc95c] sm:text-sm"
                    />
                    <input
                      type="url"
                      placeholder="Link URL"
                      defaultValue={link.link}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ffc95c] focus:ring-[#ffc95c] sm:text-sm"
                    />
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
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
                {artist.music?.map((item, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                      <Image
                        src={item.image.url}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Track Name"
                      defaultValue={item.name}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ffc95c] focus:ring-[#ffc95c] sm:text-sm"
                    />
                    <input
                      type="url"
                      placeholder="Streaming Link"
                      defaultValue={item.link}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ffc95c] focus:ring-[#ffc95c] sm:text-sm"
                    />
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
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