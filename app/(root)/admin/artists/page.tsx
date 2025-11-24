import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import fs from 'fs/promises';
import path from 'path';

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

async function getArtists(): Promise<Artist[]> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'idrcrds.json');
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export default async function AdminArtistsPage() {
  const artists = await getArtists();

  return (
    <div className="min-h-full bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Artists</h1>
          <Link
            href="/admin/artists/new"
            className="bg-[#ffc95c] hover:bg-[#ffc95c]/90 text-black px-6 py-2 rounded-full font-medium transition-colors"
          >
            Add New Artist
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Artist
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Links
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Music
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {artists.map((artist) => (
                  <tr key={artist.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <Image
                            src={artist.Photo?.url || '/placeholder-artist.jpg'}
                            alt={artist.ArtistName}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {artist.ArtistName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {artist.bioM}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {artist.links?.length || 0} links
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {artist.music?.length || 0} tracks
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/artists/${artist.id}/edit`}
                        className="text-[#ffc95c] hover:text-[#ffc95c]"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}