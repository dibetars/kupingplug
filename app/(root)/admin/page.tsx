export default function AdminIndexPage() {
  const cards = [
    { title: 'Artists', desc: 'Manage artist bios, links, and media', href: '/admin/artists' },
    { title: 'Site Content', desc: 'Edit mission, subtitle, booking, closing', href: '/admin/content' },
    { title: 'Services', desc: 'Edit packages, additional, scenarios', href: '/admin/services' },
    { title: 'Gallery', desc: 'Manage images and videos', href: '/admin/gallery' },
  ];
  return (
    <div className="min-h-full bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {cards.map((c) => (
            <a key={c.title} href={c.href} className="block rounded-lg bg-white shadow p-6 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-2">{c.title}</h2>
              <p className="text-gray-600 text-sm">{c.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}