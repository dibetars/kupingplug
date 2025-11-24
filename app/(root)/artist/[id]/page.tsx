import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { generateSlug } from '@/lib/utils';
import './styles.css';
import fs from 'fs/promises';
import path from 'path';
import { InstagramIcon, FacebookIcon, YoutubeIcon, SpotifyIcon, AppleMusicIcon } from '@/components/ui/assets/svg';

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

async function getArtistBySlug(slug: string): Promise<Artist | null> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'idrcrds.json');
    const data = await fs.readFile(filePath, 'utf8');
    const artists: Artist[] = JSON.parse(data);
    return artists.find((artist) => generateSlug(artist.ArtistName) === slug) || null;
  } catch {
    return null;
  }
}

export default async function ArtistDetailPage({
  params
}: {
  params: { id: string }
}) {
  const artist = await getArtistBySlug(params.id);

  if (!artist) {
    notFound();
  }

  return (
    <div className="min-h-full bg-[#ffc95c]/10">
      {/* Back Button - Moved to top */}
      <div className="container mx-auto px-4 py-6">
        <Link
          href="/artist"
          className="inline-flex items-center text-gray-800 hover:text-black transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Artists
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="relative h-full w-full zoom-container">
          <Image
            src={artist.Photo?.url || '/placeholder-artist.jpg'}
            alt={artist.ArtistName}
            fill
            className="object-cover object-center zoom-image"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto max-w-7xl">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-5xl font-bold mb-6">{artist.ArtistName}</h1>
                {artist.links && artist.links.length > 0 && (
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
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                        >
                          <Icon className="h-5 w-5" fill="#ffffff" stroke="#ffffff" />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
              {/* Albums Section */}
              {artist.music && artist.music.length > 0 && (
                <div className="flex gap-4">
                  {artist.music.map((item, index) => (
                    <a
                      key={index}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative w-[120px] h-[120px] rounded-lg shadow-lg transform transition-transform duration-300 hover:-translate-y-2"
                    >
                      <Image
                        src={item.image.url}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                      <div className="absolute bottom-0 left-0 right-0 p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="text-sm font-semibold truncate">{item.name}</h3>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      {artist.bioM && (
        <section className="py-16 bg-[#ffc95c]/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">About {artist.ArtistName}</h2>
              <div className="prose prose-lg max-w-none">
                {artist.bioM.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-6 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}