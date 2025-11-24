import fs from 'fs/promises';
import path from 'path';

async function getContactText(): Promise<{ booking: string; closing: string }> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'site-content.txt');
    const txt = await fs.readFile(filePath, 'utf8');
    const lines = txt.split(/\r?\n/);
    const bookingIdx = lines.findIndex((l) => l.includes('Booking Information'));
    const closingIdx = lines.findIndex((l) => l.includes("Let’s Build Your Sound")) !== -1
      ? lines.findIndex((l) => l.includes("Let’s Build Your Sound"))
      : lines.findIndex((l) => l.includes("Let's Build Your Sound"));
    const section = (a: number, b?: number) => lines.slice(a, b ?? lines.length);
    const booking = bookingIdx !== -1
      ? section(bookingIdx + 1, closingIdx !== -1 ? closingIdx : undefined).join(' ').replace(/\s+/g, ' ').trim()
      : '';
    const closing = closingIdx !== -1
      ? section(closingIdx + 1).join(' ').replace(/\s+/g, ' ').trim()
      : '';
    return { booking, closing };
  } catch {
    return { booking: '', closing: '' };
  }
}

export default async function ContactPage() {
  const { booking, closing } = await getContactText();
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
  const subtitle = await getSubtitle();
  const contact = [booking, closing].filter(Boolean).join(' ');
  return (
    <div className="min-h-full bg-white">

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-gray-700 leading-relaxed">{contact}</p>
            <div className="mt-8">
              <a
                href="mailto:info@idrcrds.com"
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}