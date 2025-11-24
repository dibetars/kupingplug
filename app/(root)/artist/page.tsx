import React from 'react';
import Link from 'next/link';
import { InstagramIcon, FacebookIcon, YoutubeIcon, SpotifyIcon, AppleMusicIcon } from '@/components/ui/assets/svg';
import Image from 'next/image';
import { generateSlug } from '@/lib/utils';
import fs from 'fs/promises';
import path from 'path';

interface ArtistLink {
  Name: string;
  link: string;
}

interface Artist {
  id: string;
  ArtistName: string;
  Photo: {
    url: string;
    meta: {
      width: number;
      height: number;
    };
  };
  links: ArtistLink[] | null;
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

export default async function ArtistsPage() {
  const artists = await getArtists();

  return (
    <div className="min-h-full bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Artists</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover talented artists from around the world showcasing their unique perspectives and creativity.
          </p>
        </div>

        {artists.length === 0 ? (
          <div className="text-center text-gray-600 min-h-[400px] flex items-center justify-center">
            No artists found at the moment. Please check back later.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artists.map((artist) => (
              <Link 
                href={`/artist/${generateSlug(artist.ArtistName)}`}
                key={artist.id}
                className="group relative overflow-hidden rounded-lg bg-white shadow-lg transform transition-transform duration-300 hover:-translate-y-2"
              >
                <div className="relative h-64">
                  <Image
                    src={artist.Photo?.url || '/placeholder-artist.jpg'}
                    alt={artist.ArtistName || 'Artist'}
                    fill
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <h2 className="absolute bottom-4 left-4 text-2xl font-semibold text-white">
                    {artist.ArtistName || 'Unnamed Artist'}
                  </h2>
                </div>

                <div className="p-6">
                  {artist.links && Array.isArray(artist.links) && artist.links.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">
                        Connect with {artist.ArtistName}
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {artist.links.map((link, index) => {
                          if (!link || !link.link) return null;
                          const n = (link.Name || '').toLowerCase();
                          let Icon = InstagramIcon as React.FC<any>;
                          if (n.includes('spotify')) Icon = SpotifyIcon;
                          else if (n.includes('apple')) Icon = AppleMusicIcon;
                          else if (n.includes('youtube')) Icon = YoutubeIcon;
                          else if (n.includes('facebook')) Icon = FacebookIcon;
                          else if (n.includes('instagram')) Icon = InstagramIcon;
                          return (
                            <a
                              key={index}
                              href={link.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={link.Name || 'Link'}
                              title={link.Name || 'Link'}
                              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                              <Icon className="h-5 w-5" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}