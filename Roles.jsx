import { useState, useEffect, useRef } from 'react'

const Roles = () => {
  const [activeRole, setActiveRole] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  const roles = [
    {
      id: 'customer',
      title: 'Pelanggan',
      subtitle: 'Pesan dengan Mudah',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 6h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      description: 'Jelajahi menu, pesan minuman favorit, dan nikmati pengalaman kafe yang seamless.',
      features: ['Menu digital interaktif', 'Pembayaran mudah', 'Riwayat pesanan', 'Promo eksklusif'],
      color: 'forest',
      bgColor: 'bg-forest'
    },
    {
      id: 'cashier',
      title: 'Kasir',
      subtitle: 'Kelola Transaksi',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      description: 'Proses pesanan dengan cepat dan akurat. Interface intuitif untuk operasional harian.',
      features: ['POS ringkas', 'Pembayaran multi-metode', 'Cetak struk', 'Manajeme shift'],
      color: 'espresso',
      bgColor: 'bg-espresso'
    },
    {
      id: 'manager',
      title: 'Manajer / Pemilik',
      subtitle: 'Pantau Performa',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
          <path d="M12 20V10M18 20V4M6 20v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      description: 'Akses dashboard lengkap untuk memantau penjualan, inventori, dan performa bisnis.',
      features: ['Laporan real-time', 'Analisis penjualan', 'Manajemen stok', 'Multi-outlet'],
      color: 'gold',
      bgColor: 'bg-gold'
    }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="masuk" ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-forest/5 rounded-full blur-3xl"/>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl"/>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-forest tracking-widest uppercase mb-4">
            Akses Cepat
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-espresso mb-6">
            Pilih Peran Anda
          </h2>
          <p className="text-lg text-kave-600">
            Tiga jalur berbeda, satu tujuan sama: pengalaman kafe yang luar biasa
          </p>
        </div>

        {/* Role cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {roles.map((role, index) => (
            <div
              key={role.id}
              onMouseEnter={() => setActiveRole(role.id)}
              onMouseLeave={() => setActiveRole(null)}
              className={`relative group cursor-pointer transition-all duration-500 ${
                isVisible ? 'animate-reveal-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Card */}
              <div className={`relative p-8 rounded-3xl border-2 transition-all duration-500 h-full ${
                activeRole === role.id
                  ? `${role.bgColor} text-white border-transparent shadow-2xl scale-105`
                  : 'bg-white border-kave-200 hover:border-kave-300'
              }`}>
                
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-2xl mb-6 transition-colors duration-300 ${
                  activeRole === role.id
                    ? 'bg-white/20'
                    : role.color === 'forest' ? 'bg-forest/10 text-forest' :
                      role.color === 'espresso' ? 'bg-kave-100 text-espresso' :
                      'bg-gold/20 text-gold'
                }`}>
                  {role.icon}
                </div>

                {/* Content */}
                <h3 className={`font-display text-2xl font-bold mb-2 transition-colors duration-300 ${
                  activeRole === role.id ? 'text-white' : 'text-espresso'
                }`}>
                  {role.title}
                </h3>
                <p className={`text-sm font-medium mb-4 transition-colors duration-300 ${
                  activeRole === role.id ? 'text-white/80' : 'text-kave-500'
                }`}>
                  {role.subtitle}
                </p>
                <p className={`leading-relaxed mb-6 transition-colors duration-300 ${
                  activeRole === role.id ? 'text-white/90' : 'text-kave-600'
                }`}>
                  {role.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-8">
                  {role.features.map((feature, i) => (
                    <li key={i} className={`flex items-center gap-3 text-sm transition-colors duration-300 ${
                      activeRole === role.id ? 'text-white/80' : 'text-kave-600'
                    }`}>
                      <svg viewBox="0 0 24 24" fill="none" className={`w-4 h-4 flex-shrink-0 ${
                        activeRole === role.id ? 'text-white' : 'text-forest'
                      }`}>
                        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  activeRole === role.id
                    ? 'bg-white text-espresso hover:bg-cream'
                    : `${role.bgColor} text-white hover:shadow-lg`
                }`}>
                  <span>Masuk</span>
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Hover glow */}
                {activeRole === role.id && (
                  <div className={`absolute inset-0 rounded-3xl opacity-50 blur-xl -z-10 ${
                    role.color === 'forest' ? 'bg-forest' :
                    role.color === 'espresso' ? 'bg-espresso' :
                    'bg-gold'
                  }`}/>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Demo credentials */}
        <div className="mt-16 p-8 rounded-2xl bg-kave-50 border border-kave-100">
          <div className="text-center mb-6">
            <h3 className="font-display text-xl font-bold text-espresso mb-2">
              Ingin Mencoba Demo?
            </h3>
            <p className="text-kave-600">
              Gunakan kredensial berikut untuk menjelajahi sistem kami
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-xl border border-kave-100">
              <div className="text-xs text-kave-500 mb-1">Kasir</div>
              <div className="font-mono text-sm text-espresso">
                <span className="text-kave-400">user:</span> kasir | 
                <span className="text-kave-400"> pass:</span> kasir123
              </div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-kave-100">
              <div className="text-xs text-kave-500 mb-1">Manajer</div>
              <div className="font-mono text-sm text-espresso">
                <span className="text-kave-400">user:</span> manager | 
                <span className="text-kave-400"> pass:</span> manager123
              </div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-kave-100">
              <div className="text-xs text-kave-500 mb-1">Pemilik</div>
              <div className="font-mono text-sm text-espresso">
                <span className="text-kave-400">user:</span> owner | 
                <span className="text-kave-400"> pass:</span> owner123
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Roles