import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import './styles.css'; // We'll create this file next

interface ArtistLink {
  Name: string;
  link: string;
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
}

async function getArtist(id: string): Promise<Artist | null> {
  try {
    const res = await fetch(`https://x8ki-letl-twmt.n7.xano.io/api:TF3YOouP/idrcrds/${id}`, {
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch artist');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching artist:', error);
    return null;
  }
}

export default async function ArtistDetailPage({
  params
}: {
  params: { id: string }
}) {
  const artist = await getArtist(params.id);

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
            className="object-cover zoom-image"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <h1 className="text-5xl font-bold mb-4">{artist.ArtistName}</h1>
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

      {/* Social Links Section */}
      {artist.links && artist.links.length > 0 && (
        <section className="py-12 bg-[#ffc95c]">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              {artist.links.map((link, index) => (
                <a
                  key={index}
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black/10 hover:bg-black/20 text-black px-6 py-3 rounded-full 
                           transition-all duration-300 flex items-center gap-2 font-medium"
                >
                  {link.Name}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
} 