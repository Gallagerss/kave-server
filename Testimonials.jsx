import { useState, useEffect, useRef } from 'react'

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  const testimonials = [
    {
      quote: "Kave mengubah cara kami mengelola kafe. Sekarang saya bisa memantau penjualan dari mana saja, kapan saja.",
      author: "Rina Kusuma",
      role: "Pemilik Kopi Nusantara",
      location: "Jakarta",
      avatar: "RK",
      rating: 5
    },
    {
      quote: "Interface yang sangat intuitif. Tim kami tidak butuh waktu lama untuk beradaptasi dengan sistem ini.",
      author: "Budi Santoso",
      role: "Manager Brew House",
      location: "Bandung",
      avatar: "BS",
      rating: 5
    },
    {
      quote: "Fitur laporannya sangat membantu dalam mengambil keputusan bisnis. Data yang akurat dan real-time.",
      author: "Maya Putri",
      role: "Pemilik Bean There",
      location: "Surabaya",
      avatar: "MP",
      rating: 5
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

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 bg-espresso text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%">
          <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="15" cy="15" r="1.5" fill="#c9a962"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#dots)"/>
        </svg>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-forest/20 rounded-full blur-3xl"/>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gold/10 rounded-full blur-3xl"/>

      <div className="relative max-w-5xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className={`text-center mb-16 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
          <span className="inline-block text-sm font-semibold text-gold tracking-widest uppercase mb-4">
            Motivasi
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Dipercaya oleh Kafe Terbaik
          </h2>
        </div>

        {/* Testimonial carousel */}
        <div className={`relative ${isVisible ? 'animate-reveal-up stagger-2' : 'opacity-0'}`}>
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="text-center max-w-3xl mx-auto">
                    {/* Quote icon */}
                    <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12 mx-auto mb-8 text-gold/50">
                      <path d="M10 11L8 17H4l2-6H4V7h6v4zm10 0l-2 6h-4l2-6h-2V7h6v4z" fill="currentColor"/>
                    </svg>

                    {/* Quote */}
                    <blockquote className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium leading-relaxed mb-8 text-white/90">
                      "{testimonial.quote}"
                    </blockquote>

                    {/* Rating */}
                    <div className="flex justify-center gap-1 mb-6">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <svg key={i} viewBox="0 0 24 24" className="w-5 h-5 text-gold">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                        </svg>
                      ))}
                    </div>

                    {/* Author */}
                    <div className="flex items-center justify-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-forest flex items-center justify-center font-bold text-gold">
                        {testimonial.avatar}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-white">{testimonial.author}</div>
                        <div className="text-sm text-white/60">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center gap-2 mt-12">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? 'w-8 bg-gold'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className={`mt-16 pt-16 border-t border-white/10 ${isVisible ? 'animate-reveal-up stagger-3' : 'opacity-0'}`}>
          <p className="text-center text-white/40 text-sm mb-8">
            Dipercaya oleh lebih dari 500 kafe di seluruh Indonesia
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
            {['Kopi Kenangan', 'Janji Jiwa', 'Starbucks', 'Kopi Kade', 'Anomali'].map((brand, i) => (
              <div key={i} className="text-xl lg:text-2xl font-display font-bold text-white/20 hover:text-white/40 transition-colors duration-300">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials