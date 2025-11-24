import fs from 'fs/promises';
import path from 'path';

function parseSections(txt: string) {
  const lines = txt.split(/\r?\n/);
  const findLine = (s: string) => lines.findIndex((l) => l.includes(s));
  const section = (a: number, b?: number) => lines.slice(a, b ?? lines.length);
  const getSubtitle = () => {
    const mark = 'Subtitle - ';
    const idx = txt.indexOf(mark);
    if (idx !== -1) {
      const rest = txt.slice(idx + mark.length);
      const endIdx = rest.indexOf('\n');
      return (endIdx !== -1 ? rest.slice(0, endIdx) : rest).replace(/\s+/g, ' ').trim();
    }
    return '';
  };
  const getMission = () => {
    const start = txt.indexOf('At ID RCRDS');
    const end = txt.indexOf('IDENTITY', start);
    if (start !== -1 && end !== -1) {
      return txt.slice(start, end).trim();
    }
    return '';
  };
  const getBooking = () => {
    const b = 'Booking Information';
    const c1 = 'Let’s Build Your Sound';
    const c2 = "Let's Build Your Sound";
    const bIdx = txt.indexOf(b);
    const cIdx = txt.indexOf(c1) !== -1 ? txt.indexOf(c1) : txt.indexOf(c2);
    if (bIdx !== -1) {
      const from = txt.indexOf('\n', bIdx) + 1;
      const to = cIdx !== -1 ? cIdx : txt.length;
      return txt.slice(from, to).trim();
    }
    return '';
  };
  const getClosing = () => {
    const c1 = 'Let’s Build Your Sound';
    const c2 = "Let's Build Your Sound";
    const cIdx = txt.indexOf(c1) !== -1 ? txt.indexOf(c1) : txt.indexOf(c2);
    if (cIdx !== -1) {
      const from = txt.indexOf('\n', cIdx) + 1;
      return txt.slice(from).trim();
    }
    return '';
  };
  const getServices = () => {
    const startIdx = findLine('Recording Packages');
    const addIdx = findLine('Additional Studio Services');
    const budgetIdx = findLine('Sample Budget Scenarios');
    const bookingIdx = findLine('Booking Information');
    const closingIdx = findLine('Let’s Build Your Sound') !== -1 ? findLine('Let’s Build Your Sound') : findLine("Let's Build Your Sound");

    const rec = startIdx !== -1 ? section(startIdx + 1, addIdx !== -1 ? addIdx : undefined) : [];
    const pkgBlocks: { title: string; price: string; bullets: string[] }[] = [];
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
    for (let i = 0; i < rec.length; i++) {
      const line = rec[i];
      if (!line.trim()) continue;
      const parts = line.split('–');
      if (parts.length >= 2) {
        const title = parts[0].trim();
        const price = parts.slice(1).join('–').trim();
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

    const scenarioAIdx = findLine('Scenario A');
    const scenarioBIdx = findLine('Scenario B');
    const scenarioEndIdx = bookingIdx !== -1 ? bookingIdx : undefined;
    const scenarioASection = scenarioAIdx !== -1 ? section(scenarioAIdx, scenarioBIdx !== -1 ? scenarioBIdx : scenarioEndIdx) : [];
    const scenarioBSection = scenarioBIdx !== -1 ? section(scenarioBIdx, scenarioEndIdx) : [];
    const pullItems = (arr: string[]) => arr.filter((l) => l.trim().startsWith('•')).map((l) => l.replace(/^\s*•\s*/, '').trim());
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

    return { packages: pkgBlocks, additionalServices: additional, scenarioA, scenarioB };
  };
  const services = getServices();
  return { subtitle: getSubtitle(), mission: getMission(), booking: getBooking(), closing: getClosing(), ...services };
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'site-content.txt');
    const txt = await fs.readFile(filePath, 'utf8');
    return Response.json(parseSections(txt));
  } catch {
    return Response.json({ subtitle: '', mission: '', booking: '', closing: '' });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { subtitle, mission, booking, closing, packages, additionalServices, scenarioA, scenarioB } = body as any;
    const filePath = path.join(process.cwd(), 'data', 'site-content.txt');
    let txt = await fs.readFile(filePath, 'utf8');
    let lines = txt.split(/\r?\n/);
    const findLine = (s: string) => lines.findIndex((l) => l.includes(s));

    if (typeof subtitle === 'string') {
      const mark = 'Subtitle - ';
      const idx = txt.indexOf(mark);
      if (idx !== -1) {
        const rest = txt.slice(idx + mark.length);
        const endIdx = rest.indexOf('\n');
        const before = txt.slice(0, idx);
        const after = endIdx !== -1 ? rest.slice(endIdx) : '';
        txt = `${before}${mark}${subtitle}\n${after}`;
        lines = txt.split(/\r?\n/);
      }
    }

    if (typeof mission === 'string') {
      const start = txt.indexOf('At ID RCRDS');
      const end = txt.indexOf('IDENTITY', start);
      if (start !== -1 && end !== -1) {
        const before = txt.slice(0, start);
        const after = txt.slice(end);
        txt = `${before}${mission}\n${after}`;
        lines = txt.split(/\r?\n/);
      }
    }

    if (typeof booking === 'string') {
      const b = 'Booking Information';
      const c1 = 'Let’s Build Your Sound';
      const c2 = "Let's Build Your Sound";
      const bIdx = txt.indexOf(b);
      const cIdx = txt.indexOf(c1) !== -1 ? txt.indexOf(c1) : txt.indexOf(c2);
      if (bIdx !== -1) {
        const headerEnd = txt.indexOf('\n', bIdx) + 1;
        const before = txt.slice(0, headerEnd);
        const after = cIdx !== -1 ? txt.slice(cIdx) : '';
        txt = `${before}${booking}\n${after}`;
        lines = txt.split(/\r?\n/);
      }
    }

    if (typeof closing === 'string') {
      const c1 = 'Let’s Build Your Sound';
      const c2 = "Let's Build Your Sound";
      const cIdx = txt.indexOf(c1) !== -1 ? txt.indexOf(c1) : txt.indexOf(c2);
      if (cIdx !== -1) {
        const headerEnd = txt.indexOf('\n', cIdx) + 1;
        const before = txt.slice(0, headerEnd);
        txt = `${before}${closing.trim()}\n`;
        lines = txt.split(/\r?\n/);
      }
    }

    if (Array.isArray(packages)) {
      const recIdx = findLine('Recording Packages');
      const addIdx = findLine('Additional Studio Services');
      if (recIdx !== -1) {
        const before = lines.slice(0, recIdx + 1);
        const after = addIdx !== -1 ? lines.slice(addIdx) : [];
        const content: string[] = [];
        for (const pkg of packages) {
          content.push(`${String(pkg.title || '').trim()} – ${String(pkg.price || '').trim()}`);
          const bullets = Array.isArray(pkg.bullets) ? pkg.bullets : [];
          for (const b of bullets) content.push(`• ${String(b).trim()}`);
        }
        lines = [...before, ...content, ...after];
        txt = lines.join('\n');
      }
    }

    if (Array.isArray(additionalServices)) {
      const addIdx = findLine('Additional Studio Services');
      const budgetIdx = findLine('Sample Budget Scenarios');
      if (addIdx !== -1 && budgetIdx !== -1) {
        const before = lines.slice(0, addIdx + 1);
        const after = lines.slice(budgetIdx);
        const content = additionalServices.map((s) => `• ${String(s).trim()}`);
        lines = [...before, ...content, ...after];
        txt = lines.join('\n');
      }
    }

    if (scenarioA || scenarioB) {
      const aIdx = findLine('Scenario A');
      const bIdx = findLine('Scenario B');
      const bookingIdx = findLine('Booking Information');
      if (aIdx !== -1 && bookingIdx !== -1) {
        const before = lines.slice(0, aIdx);
        const after = lines.slice(bookingIdx);
        const block: string[] = [];
        if (scenarioA) {
          block.push(String(scenarioA.title || 'Scenario A'));
          const items = Array.isArray(scenarioA.items) ? scenarioA.items : [];
          for (const it of items) block.push(`• ${String(it).trim()}`);
          if (scenarioA.total) block.push(`Estimated Total: ${String(scenarioA.total).trim()}`);
        } else if (aIdx !== -1) {
          block.push(lines[aIdx]);
        }
        if (scenarioB) {
          block.push(String(scenarioB.title || 'Scenario B'));
          const items = Array.isArray(scenarioB.items) ? scenarioB.items : [];
          for (const it of items) block.push(`• ${String(it).trim()}`);
          if (scenarioB.total) block.push(`Estimated Total: ${String(scenarioB.total).trim()}`);
        } else if (bIdx !== -1) {
          block.push(lines[bIdx]);
        }
        lines = [...before, ...block, ...after];
        txt = lines.join('\n');
      }
    }

    await fs.writeFile(filePath, txt, 'utf8');
    return Response.json(parseSections(txt));
  } catch {
    return Response.json({ error: 'Internal Error' }, { status: 500 });
  }
}