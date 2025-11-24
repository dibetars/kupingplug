'use client';

import React from 'react';

type RecordingPackage = { title: string; price: string; bullets: string[] };
type Scenario = { title: string; items: string[]; total: string };

export default function AdminServicesPage() {
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [packages, setPackages] = React.useState<RecordingPackage[]>([]);
  const [additional, setAdditional] = React.useState<string[]>([]);
  const [scenarioA, setScenarioA] = React.useState<Scenario>({ title: 'Scenario A', items: [], total: '' });
  const [scenarioB, setScenarioB] = React.useState<Scenario>({ title: 'Scenario B', items: [], total: '' });
  const [error, setError] = React.useState<string | null>(null);
  const [savedAt, setSavedAt] = React.useState<number | null>(null);

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/site-content', { cache: 'no-store' });
        const data = await res.json();
        setPackages(data.packages || []);
        setAdditional(data.additionalServices || []);
        setScenarioA(data.scenarioA || { title: 'Scenario A', items: [], total: '' });
        setScenarioB(data.scenarioB || { title: 'Scenario B', items: [], total: '' });
      } catch (e) {
        setError('Failed to load services');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/site-content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packages, additionalServices: additional, scenarioA, scenarioB }),
      });
      if (!res.ok) throw new Error('Failed to save');
      const data = await res.json();
      setPackages(data.packages || packages);
      setAdditional(data.additionalServices || additional);
      setScenarioA(data.scenarioA || scenarioA);
      setScenarioB(data.scenarioB || scenarioB);
      setSavedAt(Date.now());
    } catch (e) {
      setError('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const addPackage = () => setPackages([...packages, { title: '', price: '', bullets: [] }]);
  const removePackage = (i: number) => setPackages(packages.filter((_, idx) => idx !== i));
  const updatePackage = (i: number, key: keyof RecordingPackage, val: any) => {
    const next = [...packages];
    (next[i] as any)[key] = val;
    setPackages(next);
  };
  const addBullet = (i: number) => updatePackage(i, 'bullets', [...packages[i].bullets, '']);
  const updateBullet = (i: number, bi: number, val: string) => {
    const next = [...packages];
    next[i].bullets = next[i].bullets.map((b, idx) => (idx === bi ? val : b));
    setPackages(next);
  };
  const removeBullet = (i: number, bi: number) => {
    const next = [...packages];
    next[i].bullets = next[i].bullets.filter((_, idx) => idx !== bi);
    setPackages(next);
  };

  const addAdditional = () => setAdditional([...additional, '']);
  const updateAdditional = (i: number, val: string) => setAdditional(additional.map((s, idx) => (idx === i ? val : s)));
  const removeAdditional = (i: number) => setAdditional(additional.filter((_, idx) => idx !== i));

  const updateScenarioAItem = (i: number, val: string) => setScenarioA({ ...scenarioA, items: scenarioA.items.map((s, idx) => (idx === i ? val : s)) });
  const addScenarioAItem = () => setScenarioA({ ...scenarioA, items: [...scenarioA.items, ''] });
  const removeScenarioAItem = (i: number) => setScenarioA({ ...scenarioA, items: scenarioA.items.filter((_, idx) => idx !== i) });
  const updateScenarioBItem = (i: number, val: string) => setScenarioB({ ...scenarioB, items: scenarioB.items.map((s, idx) => (idx === i ? val : s)) });
  const addScenarioBItem = () => setScenarioB({ ...scenarioB, items: [...scenarioB.items, ''] });
  const removeScenarioBItem = (i: number) => setScenarioB({ ...scenarioB, items: scenarioB.items.filter((_, idx) => idx !== i) });

  return (
    <div className="min-h-full bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Services Content</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="space-y-12">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Recording Packages</h2>
                  <button onClick={addPackage} className="text-[#ffc95c]">+ Add Package</button>
                </div>
                <div className="space-y-6">
                  {packages.map((pkg, i) => (
                    <div key={i} className="border rounded-md p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input value={pkg.title} onChange={(e) => updatePackage(i, 'title', e.target.value)} placeholder="Title" className="rounded-md border-gray-300 shadow-sm" />
                        <input value={pkg.price} onChange={(e) => updatePackage(i, 'price', e.target.value)} placeholder="Price" className="rounded-md border-gray-300 shadow-sm" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Bullets</span>
                          <button onClick={() => addBullet(i)} className="text-[#ffc95c]">+ Add Bullet</button>
                        </div>
                        <div className="space-y-2">
                          {pkg.bullets.map((b, bi) => (
                            <div key={bi} className="flex gap-2">
                              <input value={b} onChange={(e) => updateBullet(i, bi, e.target.value)} className="flex-1 rounded-md border-gray-300 shadow-sm" />
                              <button onClick={() => removeBullet(i, bi)} className="text-red-600">Remove</button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button onClick={() => removePackage(i)} className="text-red-600">Remove Package</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Additional Studio Services</h2>
                  <button onClick={addAdditional} className="text-[#ffc95c]">+ Add Item</button>
                </div>
                <div className="space-y-2">
                  {additional.map((s, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={s} onChange={(e) => updateAdditional(i, e.target.value)} className="flex-1 rounded-md border-gray-300 shadow-sm" />
                      <button onClick={() => removeAdditional(i)} className="text-red-600">Remove</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="border rounded-md p-4 space-y-4">
                  <h2 className="text-xl font-semibold">Scenario A</h2>
                  <input value={scenarioA.title} onChange={(e) => setScenarioA({ ...scenarioA, title: e.target.value })} className="w-full rounded-md border-gray-300 shadow-sm" />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Items</span>
                      <button onClick={addScenarioAItem} className="text-[#ffc95c]">+ Add Item</button>
                    </div>
                    {scenarioA.items.map((it, i) => (
                      <div key={i} className="flex gap-2">
                        <input value={it} onChange={(e) => updateScenarioAItem(i, e.target.value)} className="flex-1 rounded-md border-gray-300 shadow-sm" />
                        <button onClick={() => removeScenarioAItem(i)} className="text-red-600">Remove</button>
                      </div>
                    ))}
                  </div>
                  <input value={scenarioA.total} onChange={(e) => setScenarioA({ ...scenarioA, total: e.target.value })} placeholder="Estimated Total" className="w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div className="border rounded-md p-4 space-y-4">
                  <h2 className="text-xl font-semibold">Scenario B</h2>
                  <input value={scenarioB.title} onChange={(e) => setScenarioB({ ...scenarioB, title: e.target.value })} className="w-full rounded-md border-gray-300 shadow-sm" />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Items</span>
                      <button onClick={addScenarioBItem} className="text-[#ffc95c]">+ Add Item</button>
                    </div>
                    {scenarioB.items.map((it, i) => (
                      <div key={i} className="flex gap-2">
                        <input value={it} onChange={(e) => updateScenarioBItem(i, e.target.value)} className="flex-1 rounded-md border-gray-300 shadow-sm" />
                        <button onClick={() => removeScenarioBItem(i)} className="text-red-600">Remove</button>
                      </div>
                    ))}
                  </div>
                  <input value={scenarioB.total} onChange={(e) => setScenarioB({ ...scenarioB, total: e.target.value })} placeholder="Estimated Total" className="w-full rounded-md border-gray-300 shadow-sm" />
                </div>
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}
              {savedAt && <p className="text-green-600 text-sm">Saved at {new Date(savedAt).toLocaleTimeString()}</p>}

              <div className="flex justify-end">
                <button onClick={save} disabled={saving} className="bg-[#ffc95c] hover:bg-[#ffc95c]/90 text-black py-2 px-4 rounded-md shadow-sm text-sm font-medium disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}