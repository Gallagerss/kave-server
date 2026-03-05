import { useEffect, useState, useRef } from 'react'

const Hero = ({ scrollY, mousePosition }) => {
  const [isVisible, setIsVisible] = useState(false)
  const heroRef = useRef(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const coffeeBeans = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    rotation: Math.random() * 360,
    delay: Math.random() * 2,
    size: 0.5 + Math.random() * 0.5
  }))

  return (
    <section 
      id="beranda" 
      ref={heroRef}
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Content */}
          <div className={`space-y-8 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest/10 border border-forest/20">
              <span className="w-2 h-2 rounded-full bg-forest animate-pulse" />
              <span className="text-sm font-medium text-forest">
                Sistem POS untuk Kafe Modern
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
              <span className="gradient-text">Tumbuh Bersama,</span>
              <br />
              <span className="text-espresso">Secara Alami</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-kave-600 max-w-lg leading-relaxed">
              Kelola kafe Anda dengan sistem yang sederhana dan handal. 
              Seperti tanah yang subur dan teman yang setia, kami hadir untuk mendukung pertumbuhan bisnis Anda.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#mulai"
                className="btn-primary group inline-flex items-center justify-center gap-3 px-8 py-4 bg-forest text-white rounded-full font-semibold text-lg hover:bg-kave-700 transition-all duration-300 shadow-lg shadow-forest/25"
              >
                <span>Coba Sekarang</span>
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 20 20" 
                  fill="none" 
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a
                href="#fitur"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-espresso font-semibold text-lg hover:text-forest transition-colors duration-300 group"
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 20 20" 
                  fill="none"
                  className="transition-transform duration-300 group-hover:scale-110"
                >
                  <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 7l5 3-5 3V7z" fill="currentColor"/>
                </svg>
                <span>Lihat Demo</span>
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8 border-t border-kave-200">
              {[
                { value: '500+', label: 'Kafe Terdaftar' },
                { value: '1.2M', label: 'Transaksi/Bulan' },
                { value: '99.9%', label: 'Uptime' },
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                  <div className="font-display text-2xl sm:text-3xl font-bold text-espresso">
                    {stat.value}
                  </div>
                  <div className="text-sm text-kave-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Coffee Cup Illustration */}
          <div 
            className={`relative ${isVisible ? 'animate-reveal-scale' : 'opacity-0'}`}
            style={{
              transform: `translateY(${scrollY * 0.1}px) rotate(${mousePosition.x * 2}deg)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            {/* Floating coffee beans */}
            {coffeeBeans.map((bean) => (
              <div
                key={bean.id}
                className="absolute animate-float pointer-events-none"
                style={{
                  left: `${bean.x}%`,
                  top: `${bean.y}%`,
                  transform: `rotate(${bean.rotation}deg) scale(${bean.size})`,
                  animationDelay: `${bean.delay}s`,
                  opacity: 0.6
                }}
              >
                <CoffeeBean />
              </div>
            ))}

            {/* Main coffee cup */}
            <div className="relative mx-auto w-80 sm:w-96 lg:w-[28rem]">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold/30 to-forest/20 rounded-full blur-3xl scale-75 animate-pulse-glow" />
              
              {/* Cup SVG */}
              <svg viewBox="0 0 400 400" className="relative z-10 w-full h-auto">
                {/* Steam */}
                <g className="animate-steam">
                  <path d="M180 80 Q175 60 180 40 Q185 20 180 0" stroke="#2d4a3e" strokeWidth="3" fill="none" opacity="0.3" strokeLinecap="round"/>
                </g>
                <g className="animate-steam" style={{ animationDelay: '0.5s' }}>
                  <path d="M200 90 Q195 70 200 50 Q205 30 200 10" stroke="#2d4a3e" strokeWidth="3" fill="none" opacity="0.3" strokeLinecap="round"/>
                </g>
                <g className="animate-steam" style={{ animationDelay: '1s' }}>
                  <path d="M220 80 Q215 60 220 40 Q225 20 220 0" stroke="#2d4a3e" strokeWidth="3" fill="none" opacity="0.3" strokeLinecap="round"/>
                </g>

                {/* Cup body */}
                <ellipse cx="200" cy="300" rx="120" ry="30" fill="#4a3425"/>
                <path 
                  d="M80 150 Q80 300 200 330 Q320 300 320 150 Z" 
                  fill="url(#cupGradient)"
                />
                
                {/* Coffee liquid */}
                <ellipse cx="200" cy="160" rx="115" ry="35" fill="#1a120b"/>
                <ellipse cx="200" cy="160" rx="100" ry="28" fill="#2d1f15"/>
                <ellipse cx="185" cy="155" rx="30" ry="10" fill="#3d2a1f" opacity="0.5"/>
                
                {/* Cup rim */}
                <ellipse cx="200" cy="150" rx="120" ry="35" fill="none" stroke="#fdfbf7" strokeWidth="8"/>
                
                {/* Handle */}
                <path 
                  d="M320 180 Q380 180 380 240 Q380 300 320 280" 
                  fill="none" 
                  stroke="url(#cupGradient)" 
                  strokeWidth="25"
                  strokeLinecap="round"
                />
                
                {/* Saucer */}
                <ellipse cx="200" cy="340" rx="150" ry="25" fill="#e0ccb0"/>
                <ellipse cx="200" cy="340" rx="130" ry="20" fill="#f0e6d8"/>
                
                <defs>
                  <linearGradient id="cupGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fdfbf7"/>
                    <stop offset="50%" stopColor="#f0e6d8"/>
                    <stop offset="100%" stopColor="#e0ccb0"/>
                  </linearGradient>
                </defs>
              </svg>

              {/* Badge */}
              <div className="absolute -bottom-4 -right-4 sm:right-0 bg-forest text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                Premium Quality
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
        <span className="text-xs text-kave-500 font-medium tracking-widest uppercase">Scroll</span>
        <div className="w-6 h-10 rounded-full border-2 border-kave-300 flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-forest rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}

const CoffeeBean = () => (
  <svg width="20" height="30" viewBox="0 0 20 30" fill="none" className="drop-shadow-md">
    <ellipse cx="10" cy="15" rx="8" ry="13" fill="#4a3425"/>
    <path d="M10 5 Q8 15 10 25" stroke="#2d1f15" strokeWidth="1.5" fill="none"/>
  </svg>
)

export default Hero