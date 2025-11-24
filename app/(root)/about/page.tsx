import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { InstagramIcon, FacebookIcon, YoutubeIcon, SpotifyIcon, AppleMusicIcon } from '@/components/ui/assets/svg';
import { generateSlug } from '@/lib/utils';
import fs from 'fs/promises';
import path from 'path';

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
    const filePath = path.join(process.cwd(), 'data', 'idrcrds.json');
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function getMissionText(): Promise<string> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'site-content.txt');
    const txt = await fs.readFile(filePath, 'utf8');
    const start = txt.indexOf('At ID RCRDS');
    const end = txt.indexOf('IDENTITY', start);
    if (start !== -1 && end !== -1) {
      return txt.slice(start, end).replace(/\s+/g, ' ').trim();
    }
    return txt.trim().replace(/\s+/g, ' ').slice(0, 600);
  } catch {
    return 'ID RCRDS is more than just a record label — we\'re a community of visionaries, innovators, and passionate music creators.';
  }
}

async function getSubtitle(): Promise<string> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'site-content.txt');
    const txt = await fs.readFile(filePath, 'utf8');
    const mark = 'Subtitle - ';
    const idx = txt.indexOf(mark);
    if (idx !== -1) {
      const rest = txt.slice(idx + mark.length);
      const endIdx = rest.indexOf('\n');
      return (endIdx !== -1 ? rest.slice(0, endIdx) : rest).replace(/\s+/g, ' ').trim();
    }
    return 'IDENTITY // IDEAS // IDEALS';
  } catch {
    return 'IDENTITY // IDEAS // IDEALS';
  }
}

type RecordingPackage = { title: string; price: string; bullets: string[] };
type ServicesContent = {
  packages: RecordingPackage[];
  additionalServices: string[];
  scenarioA: { title: string; items: string[]; total: string };
  scenarioB: { title: string; items: string[]; total: string };
  booking: string;
  closing: string;
};

async function getServices(): Promise<ServicesContent | null> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'site-content.txt');
    const txt = await fs.readFile(filePath, 'utf8');
    const lines = txt.split(/\r?\n/);
    const findLine = (s: string) => lines.findIndex((l) => l.includes(s));
    const startIdx = findLine('Recording Packages');
    if (startIdx === -1) return null;
    const addIdx = findLine('Additional Studio Services');
    const budgetIdx = findLine('Sample Budget Scenarios');
    const bookingIdx = findLine('Booking Information');
    const closingIdx = findLine("Let’s Build Your Sound") !== -1 ? findLine("Let’s Build Your Sound") : findLine("Let's Build Your Sound");

    const section = (a: number, b?: number) => lines.slice(a, b ?? lines.length);
    const rec = section(startIdx + 1, addIdx !== -1 ? addIdx : undefined);
    const pkgBlocks: RecordingPackage[] = [];
    const parseBullets = (arr: string[], from: number) => {
      const bullets: string[] = [];
      for (let i = from; i < arr.length; i++) {
        const t = arr[i].trim();
        if (t.startsWith('•')) bullets.push(t.replace(/^•\s*/, '').trim());
        else if (t === '') continue;
        else break;
      }
      return bullets;
    };
    const pkgTitles = ['Basic –', 'Pro –', 'Pro Plus –'];
    for (let i = 0; i < rec.length; i++) {
      const line = rec[i];
      const matchTitle = pkgTitles.find((k) => line.includes(k));
      if (matchTitle) {
        const titleLine = line.trim();
        const title = titleLine.split('–')[0].trim();
        const price = titleLine.split('–').slice(1).join('–').trim();
        const bullets = parseBullets(rec, i + 1);
        pkgBlocks.push({ title, price, bullets });
      }
    }

    const additional = addIdx !== -1 && budgetIdx !== -1
      ? section(addIdx + 1, budgetIdx)
          .map((l) => l.trim())
          .filter((l) => l.length > 0 && l.startsWith('•'))
          .map((l) => l.replace(/^•\s*/, '').trim())
      : [];

    const scenarioAIdx = findLine('Scenario A:');
    const scenarioBIdx = findLine('Scenario B:');
    const scenarioEndIdx = bookingIdx !== -1 ? bookingIdx : undefined;
    const scenarioASection = scenarioAIdx !== -1 ? section(scenarioAIdx, scenarioBIdx !== -1 ? scenarioBIdx : scenarioEndIdx) : [];
    const scenarioBSection = scenarioBIdx !== -1 ? section(scenarioBIdx, scenarioEndIdx) : [];
    const pullItems = (arr: string[]) => arr.filter((l) => l.includes('•')).map((l) => l.replace(/^\s*•\s*/, '').trim());
    const pullTotal = (arr: string[]) => {
      const t = arr.find((l) => l.trim().startsWith('Estimated Total'));
      return t ? t.trim().replace(/^Estimated Total:\s*/, '') : '';
    };
    const scenarioA = {
      title: scenarioASection[0]?.trim() || 'Scenario A',
      items: pullItems(scenarioASection),
      total: pullTotal(scenarioASection),
    };
    const scenarioB = {
      title: scenarioBSection[0]?.trim() || 'Scenario B',
      items: pullItems(scenarioBSection),
      total: pullTotal(scenarioBSection),
    };

    const bookingText = bookingIdx !== -1 ? section(bookingIdx + 1, closingIdx !== -1 ? closingIdx : undefined).join(' ').replace(/\s+/g, ' ').trim() : '';
    const closingText = closingIdx !== -1 ? section(closingIdx + 1).join(' ').replace(/\s+/g, ' ').trim() : '';

    return {
      packages: pkgBlocks,
      additionalServices: additional,
      scenarioA,
      scenarioB,
      booking: bookingText,
      closing: closingText,
    };
  } catch {
    return null;
  }
}

type GalleryItem = { title: string; media: string[]; bio: string };

async function getGallery(): Promise<GalleryItem[]> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'site-content.txt');
    const txt = await fs.readFile(filePath, 'utf8');
    const lines = txt.split(/\r?\n/).map((l) => l.trim());
    const items: GalleryItem[] = [];
    const msIdx = lines.findIndex((l) => l.toLowerCase().startsWith('midnight suns'));
    if (msIdx !== -1) {
      const title = 'Midnight Suns';
      const mediaLineIdx = lines.findIndex((l, i) => i > msIdx && l.toLowerCase().startsWith('media links'));
      const bioIdx = lines.findIndex((l, i) => i > msIdx && l.toLowerCase() === 'bio');
      const aboutTabIdx = lines.findIndex((l, i) => i > msIdx && l.toLowerCase().includes('about tab'));
      const endIdx = aboutTabIdx !== -1 ? aboutTabIdx : lines.length;
      const mediaLine = mediaLineIdx !== -1 ? lines[mediaLineIdx] : '';
      const media = mediaLine ? mediaLine.split('-')[1]?.split(',').map((s) => s.trim()).filter(Boolean) ?? [] : [];
      let bio = '';
      if (bioIdx !== -1) {
        const bioLines = lines.slice(bioIdx + 1, endIdx);
        bio = bioLines.join(' ').replace(/\s+/g, ' ').trim();
      }
      items.push({ title, media, bio });
    }
    return items;
  } catch {
    return [];
  }
}

export default async function AboutPage() {
  const artists = await getArtists();
  const mission = await getMissionText();
  const subtitle = await getSubtitle();
  const services = await getServices();
  const pillars = await (async () => {
    try {
      const filePath = path.join(process.cwd(), 'data', 'site-content.txt');
      const txt = await fs.readFile(filePath, 'utf8');
      const lines = txt.split(/\r?\n/).map((l) => l.trim());
      const identityIdx = lines.findIndex((l) => l.toUpperCase().startsWith('IDENTITY'));
      const ideasIdx = lines.findIndex((l) => l.toUpperCase().startsWith('IDEAS'));
      const idealsIdx = lines.findIndex((l) => l.toUpperCase().startsWith('IDEALS'));
      const getDesc = (start: number) => {
        if (start === -1) return '';
        for (let i = start + 1; i < lines.length; i++) {
          const t = lines[i];
          if (!t || t.toUpperCase() === 'IDENTITY' || t.toUpperCase() === 'IDEAS' || t.toUpperCase() === 'IDEALS') break;
          if (t && !t.startsWith('•')) return t;
        }
        return '';
      };
      return {
        identity: getDesc(identityIdx) || 'Defines who an artist is at their core.',
        ideas: getDesc(ideasIdx) || 'Drive what artists create and explore.',
        ideals: getDesc(idealsIdx) || 'Commitment to excellence in craft and culture.',
      };
    } catch {
      return {
        identity: 'Defines who an artist is at their core.',
        ideas: 'Drive what artists create and explore.',
        ideals: 'Commitment to excellence in craft and culture.',
      };
    }
  })();
  const gallery = await getGallery();
  const contact = services ? `${services.booking} ${services.closing}` : '';

  return (
    <div className="min-h-full bg-white">
      {/* Hero Section - No background image */}
      <section className="relative h-[60vh] bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">ID RCRDS</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto px-4">{subtitle}</p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">{mission}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">IDENTITY</h3>
                <p className="text-gray-600">{pillars.identity}</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">IDEAS</h3>
                <p className="text-gray-600">{pillars.ideas}</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">IDEALS</h3>
                <p className="text-gray-600">{pillars.ideals}</p>
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
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <h3 className="absolute bottom-4 left-4 text-2xl font-semibold text-white">
                    {artist.ArtistName}
                  </h3>
                </div>
                {artist.links && artist.links.length > 0 && (
                  <div className="p-4">
                    <div className="flex flex-wrap gap-3 items-center">
                      {artist.links.map((link, index) => {
                        const name = (link as any).Name || (link as any).name || 'Link';
                        const href = (link as any).link || '#';
                        const n = String(name).toLowerCase();
                        let Icon = InstagramIcon as React.FC<any>;
                        if (n.includes('spotify')) Icon = SpotifyIcon;
                        else if (n.includes('apple')) Icon = AppleMusicIcon;
                        else if (n.includes('youtube')) Icon = YoutubeIcon;
                        else if (n.includes('facebook')) Icon = FacebookIcon;
                        else if (n.includes('instagram')) Icon = InstagramIcon;
                        return (
                          <a
                            key={index}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={name}
                            title={name}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            <Icon className="h-5 w-5" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {gallery && gallery.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">Gallery</h2>
            <div className="max-w-4xl mx-auto space-y-12">
              {gallery.map((item) => (
                <div key={item.title} className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                  {item.media && item.media.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.media.map((m) => (
                        <span key={m} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">{m}</span>
                      ))}
                    </div>
                  )}
                  <p className="text-gray-700 leading-relaxed">{item.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
    </div>
  );
}