import { useEffect, useRef, useState } from 'react'

const Features = () => {
  const [visibleCards, setVisibleCards] = useState([])
  const sectionRef = useRef(null)

  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
          <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: 'Alur Natural',
      description: 'Sistem dirancang mengikuti cara kerja kafe Anda. Tidak perlu mengubah kebiasaan, cukup tingkatkan efisiensi.',
      color: 'forest'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: 'Tumbuh Bersama',
      description: 'Dari kedai kecil hingga jaringan besar, sistem kami berskala mengikuti pertumbuhan bisnis Anda.',
      color: 'gold'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Sederhana & Handal',
      description: 'Tanpa kerumitan yang tidak perlu. Fokus pada apa yang penting: menyajikan kopi terbaik untuk pelanggan.',
      color: 'espresso'
    }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index)
            setVisibleCards((prev) => 
              prev.includes(index) ? prev : [...prev, index]
            )
          }
        })
      },
      { threshold: 0.2 }
    )

    const cards = sectionRef.current?.querySelectorAll('.feature-card')
    cards?.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  return (
    <section id="fitur" ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1" fill="#2d4a3e"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)"/>
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <span className="inline-block text-sm font-semibold text-forest tracking-widest uppercase mb-4">
            Mengapa Kave
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-espresso mb-6">
            Dirawat dengan Sepenuh Hati
          </h2>
          <p className="text-lg text-kave-600 leading-relaxed">
            Setiap fitur dirancang dengan mempertimbangkan kebutuhan nyata 
            para pemilik kafe, barista, dan pelanggan.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              data-index={index}
              className={`feature-card card-hover relative group p-8 lg:p-10 rounded-3xl bg-white border border-kave-100 ${
                visibleCards.includes(index) ? 'animate-reveal-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Icon */}
              <div className={`inline-flex p-4 rounded-2xl mb-6 transition-all duration-300 group-hover:scale-110 ${
                feature.color === 'forest' ? 'bg-forest/10 text-forest' :
                feature.color === 'gold' ? 'bg-gold/20 text-gold' :
                'bg-kave-100 text-espresso'
              }`}>
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="font-display text-2xl font-bold text-espresso mb-4">
                {feature.title}
              </h3>
              <p className="text-kave-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover decoration */}
              <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 ${
                feature.color === 'forest' ? 'bg-forest/5' :
                feature.color === 'gold' ? 'bg-gold/5' :
                'bg-kave-50'
              }`}/>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="mt-16 lg:mt-24 p-8 lg:p-12 rounded-3xl bg-gradient-to-br from-forest to-kave-800 text-white overflow-hidden relative">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl"/>
            <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"/>
          </div>

          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-display text-3xl lg:text-4xl font-bold mb-4">
                Siap Membuat Bisnis Anda Berkembang?
              </h3>
              <p className="text-white/80 text-lg">
                Bergabung dengan ratusan kafe yang telah mempercayakan operasional mereka kepada Kave.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
              <a
                href="#mulai"
                className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-forest rounded-full font-semibold hover:bg-cream transition-all duration-300"
              >
                Coba Sistem Kami
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold hover:text-gold transition-colors duration-300"
              >
                Pelajari Lebih Lanjut
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features