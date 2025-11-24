import fs from 'fs/promises';
import path from 'path';

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

    const scenarioAIdx = lines.findIndex((l) => l.includes('Scenario A'));
    const scenarioBIdx = lines.findIndex((l) => l.includes('Scenario B'));
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

export default async function ServicesPage() {
  const services = await getServices();
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
  return (
    <div className="min-h-full bg-white">
      <section className="relative h-[60vh] bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Services</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto px-4">{subtitle}</p>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Studio Recording Services</h1>
            {services && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {services.packages.map((pkg) => (
                    <div key={pkg.title} className="p-6 bg-gray-50 rounded-lg">
                      <h3 className="text-xl font-semibold mb-2">{pkg.title}</h3>
                      <p className="text-gray-700 mb-4">{pkg.price}</p>
                      <ul className="space-y-2 text-gray-600">
                        {pkg.bullets.map((b, idx) => (
                          <li key={idx}>• {b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="mt-16">
                  <h3 className="text-2xl font-semibold mb-4">Additional Studio Services</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.additionalServices.map((s, idx) => (
                      <div key={idx} className="text-gray-700">• {s}</div>
                    ))}
                  </div>
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">{services.scenarioA.title}</h3>
                    <ul className="space-y-2 text-gray-700">
                      {services.scenarioA.items.map((i, idx) => (
                        <li key={idx}>• {i}</li>
                      ))}
                    </ul>
                    {services.scenarioA.total && (
                      <p className="mt-4 font-semibold">Estimated Total: {services.scenarioA.total}</p>
                    )}
                  </div>
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">{services.scenarioB.title}</h3>
                    <ul className="space-y-2 text-gray-700">
                      {services.scenarioB.items.map((i, idx) => (
                        <li key={idx}>• {i}</li>
                      ))}
                    </ul>
                    {services.scenarioB.total && (
                      <p className="mt-4 font-semibold">Estimated Total: {services.scenarioB.total}</p>
                    )}
                  </div>
                </div>

                <div className="mt-16">
                  <h3 className="text-2xl font-semibold mb-4">Booking Information</h3>
                  <p className="text-gray-700 leading-relaxed">{services.booking}</p>
                </div>

                <div className="mt-12">
                  <h3 className="text-2xl font-semibold mb-4">Let’s Build Your Sound</h3>
                  <p className="text-gray-700 leading-relaxed">{services.closing}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}