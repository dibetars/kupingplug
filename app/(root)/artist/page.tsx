import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
    const res = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:TF3YOouP/idrcrds', {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch artists');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching artists:', error);
    return []; // Return empty array on error
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
                href={`/artist/${artist.id}`}
                key={artist.id}
                className="group relative overflow-hidden rounded-lg bg-white shadow-lg transform transition-transform duration-300 hover:-translate-y-2"
              >
                <div className="relative h-64">
                  <Image
                    src={artist.Photo?.url || '/placeholder-artist.jpg'}
                    alt={artist.ArtistName || 'Artist'}
                    fill
                    className="object-cover"
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
                        {artist.links.map((link, index) => (
                          link && link.link && (
                            <a
                              key={index}
                              href={link.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 bg-primary/90 text-white rounded-full text-sm font-medium hover:bg-primary transition-colors duration-200"
                            >
                              {link.Name || 'Visit'}
                            </a>
                          )
                        ))}
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