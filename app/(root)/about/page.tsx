import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { generateSlug } from '@/lib/utils';

// Reuse the Artist interface and fetch function from artist page
interface ArtistLink {
  name: string;
  link: string;
  icon: {
    url: string;
  };
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
      next: { revalidate: 3600 }
    });
    if (!res.ok) throw new Error('Failed to fetch artists');
    return res.json();
  } catch (error) {
    console.error('Error fetching artists:', error);
    return [];
  }
}

export default async function AboutPage() {
  const artists = await getArtists();

  return (
    <div className="min-h-full bg-white">
      {/* Hero Section - No background image */}
      <section className="relative h-[60vh] bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">About ID RCRDS</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto px-4">
            Where Music Meets Innovation
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              ID RCRDS is more than just a record label &ndash; we&apos;re a community of visionaries, 
              innovators, and passionate music creators. Our mission is to push the boundaries 
              of electronic music while nurturing the next generation of artistic talent.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Innovation</h3>
                <p className="text-gray-600">Pushing the boundaries of sound and technology</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Community</h3>
                <p className="text-gray-600">Building connections through music</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Excellence</h3>
                <p className="text-gray-600">Committed to the highest quality in everything we do</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artists Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Our Artists</h2>
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
                    alt={artist.ArtistName}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <h3 className="absolute bottom-4 left-4 text-2xl font-semibold text-white">
                    {artist.ArtistName}
                  </h3>
                </div>
                {artist.links && artist.links.length > 0 && (
                  <div className="p-4">
                    <div className="flex flex-wrap gap-3 items-center">
                      {artist.links.map((link, index) => (
                        <a
                          key={index}
                          href={link.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 flex items-center justify-center hover:scale-110 transition-transform bg-gray-100 rounded-full"
                          title={link.name}
                        >
                          <Image
                            src={link.icon.url}
                            alt={link.name}
                            width={20}
                            height={20}
                            className="w-5 h-5 object-contain"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
    </div>
  );
} 