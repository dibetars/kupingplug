'use client';

import React from 'react';

export default function AdminContentPage() {
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [subtitle, setSubtitle] = React.useState('');
  const [mission, setMission] = React.useState('');
  const [booking, setBooking] = React.useState('');
  const [closing, setClosing] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [savedAt, setSavedAt] = React.useState<number | null>(null);

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/site-content', { cache: 'no-store' });
        const data = await res.json();
        setSubtitle(data.subtitle || '');
        setMission(data.mission || '');
        setBooking(data.booking || '');
        setClosing(data.closing || '');
      } catch (e) {
        setError('Failed to load site content');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/site-content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subtitle, mission, booking, closing }),
      });
      if (!res.ok) throw new Error('Failed to save');
      const data = await res.json();
      setSubtitle(data.subtitle || subtitle);
      setMission(data.mission || mission);
      setBooking(data.booking || booking);
      setClosing(data.closing || closing);
      setSavedAt(Date.now());
    } catch (e) {
      setError('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Site Content</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <form className="space-y-6" onSubmit={onSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ffc95c] focus:ring-[#ffc95c] sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Mission</label>
                <textarea
                  rows={6}
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ffc95c] focus:ring-[#ffc95c] sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Booking Information</label>
                <textarea
                  rows={6}
                  value={booking}
                  onChange={(e) => setBooking(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ffc95c] focus:ring-[#ffc95c] sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Closing</label>
                <textarea
                  rows={6}
                  value={closing}
                  onChange={(e) => setClosing(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ffc95c] focus:ring-[#ffc95c] sm:text-sm"
                />
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}
              {savedAt && (
                <p className="text-green-600 text-sm">Saved at {new Date(savedAt).toLocaleTimeString()}</p>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#ffc95c] hover:bg-[#ffc95c]/90 text-black py-2 px-4 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffc95c] disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}