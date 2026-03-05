const Footer = () => {
  const currentYear = new Date().getFullYear()

  const links = {
    produk: [
      { name: 'Fitur', href: '#fitur' },
      { name: 'Harga', href: '#harga' },
      { name: 'Integrasi', href: '#' },
      { name: 'API', href: '#' },
    ],
    perusahaan: [
      { name: 'Tentang Kami', href: '#' },
      { name: 'Karir', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Kontak', href: '#' },
    ],
    dukungan: [
      { name: 'Pusat Bantuan', href: '#' },
      { name: 'Dokumentasi', href: '#' },
      { name: 'Status Sistem', href: '#' },
      { name: 'Komunitas', href: '#' },
    ],
  }

  return (
    <footer className="relative bg-kave-900 text-white py-16 lg:py-24">
      {/* Top border decoration */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"/>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-3 mb-6">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" fill="#2d4a3e"/>
                <path d="M14 15C14 15 16 12 20 12C24 12 26 15 26 15C26 15 28 18 26 24C24 30 20 32 20 32C20 32 16 30 14 24C12 18 14 15 14 15Z" fill="#c9a962"/>
                <path d="M26 18C26 18 28 17 30 18C32 19 32 22 30 24C28 26 26 25 26 25" stroke="#c9a962" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className="font-display text-2xl font-bold">Kave</span>
            </a>
            <p className="text-white/60 leading-relaxed mb-6 max-w-sm">
              Sistem manajemen kafe yang sederhana, handal, dan membantu bisnis Anda tumbuh secara alami.
            </p>
            
            {/* Social links */}
            <div className="flex gap-4">
              {['instagram', 'twitter', 'linkedin'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-forest transition-colors duration-300"
                  aria-label={`Follow us on ${social}`}
                >
                  {social === 'instagram' && (
                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="18" cy="6" r="1.5" fill="currentColor"/>
                    </svg>
                  )}
                  {social === 'twitter' && (
                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {social === 'linkedin' && (
                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-4 capitalize">{category}</h4>
              <ul className="space-y-3">
                {items.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-white/60 hover:text-gold transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 mb-16">
          <div className="grid lg:grid-cols-2 gap-6 items-center">
            <div>
              <h4 className="font-display text-xl font-bold mb-2">Dapatkan Update Terbaru</h4>
              <p className="text-white/60">Tips bisnis, fitur baru, dan promo eksklusif langsung ke inbox Anda.</p>
            </div>
            <form className="flex gap-3">
              <input
                type="email"
                placeholder="Email Anda"
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-gold transition-colors duration-300"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-forest text-white rounded-xl font-semibold hover:bg-forest/80 transition-colors duration-300"
              >
                Daftar
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-white/10">
          <p className="text-white/40 text-sm">
            &copy; {currentYear} Kave. Hak cipta dilindungi.
          </p>
          <div className="flex gap-6 text-sm text-white/40">
            <a href="#" className="hover:text-white transition-colors duration-300">Kebijakan Privasi</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer