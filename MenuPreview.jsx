import { useState, useEffect, useRef } from 'react'

const MenuPreview = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [visibleItems, setVisibleItems] = useState([])
  const [cart, setCart] = useState([])
  const sectionRef = useRef(null)

  const categories = [
    { id: 'all', name: 'Semua Menu' },
    { id: 'coffee', name: 'Kopi' },
    { id: 'special', name: 'Spesial' },
  ]

  const menuItems = [
    {
      id: 1,
      name: 'Butterscotch Latte',
      description: 'Rasa mentega yang manis dan hangat, sempurna untuk menemani sore Anda',
      price: 48000,
      category: 'special',
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop'
    },
    {
      id: 2,
      name: 'Americano',
      description: 'Sederhana dan kuat. Espresso dengan air panas untuk cita rasa klasik',
      price: 38000,
      category: 'coffee',
      image: 'https://images.unsplash.com/photo-1521302080334-4bebac2763a6?w=400&h=400&fit=crop'
    },
    {
      id: 3,
      name: 'Matcha Latte',
      description: 'Green tea premium dengan susu steamed, rasa earthy yang menyegarkan',
      price: 52000,
      category: 'special',
      image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&h=400&fit=crop'
    },
    {
      id: 4,
      name: 'Palm Sugar Latte',
      description: 'Gula aren alami memberikan kemanisan yang berbeda dari gula biasa',
      price: 45000,
      category: 'special',
      image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&h=400&fit=crop'
    },
    {
      id: 5,
      name: 'Cappuccino',
      description: 'Espresso dengan steamed milk dan foam yang sempurna',
      price: 42000,
      category: 'coffee',
      image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop'
    },
    {
      id: 6,
      name: 'Cold Brew',
      description: 'Kopi seduh dingin selama 12 jam, halus dan rendah asam',
      price: 48000,
      category: 'coffee',
      image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&h=400&fit=crop'
    }
  ]

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory)

  const addToCart = (item) => {
    setCart(prev => [...prev, item])
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index)
            setVisibleItems(prev => 
              prev.includes(index) ? prev : [...prev, index]
            )
          }
        })
      },
      { threshold: 0.1 }
    )

    const items = sectionRef.current?.querySelectorAll('.menu-item')
    items?.forEach(item => observer.observe(item))

    return () => observer.disconnect()
  }, [activeCategory])

  return (
    <section id="menu" ref={sectionRef} className="relative py-24 lg:py-32 bg-gradient-to-b from-cream to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block text-sm font-semibold text-forest tracking-widest uppercase mb-4">
            Menu Kami
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-espresso mb-6">
            Coba Favorit Kami
          </h2>
          <p className="text-lg text-kave-600">
            Setiap cangkir diseduh dengan penuh perhatian, menggunakan biji kopi pilihan dari petani lokal
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 ${
                activeCategory === cat.id
                  ? 'bg-forest text-white shadow-lg shadow-forest/25'
                  : 'bg-kave-100 text-kave-700 hover:bg-kave-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Cart indicator */}
        {cart.length > 0 && (
          <div className="fixed bottom-6 right-6 z-50 animate-reveal-scale">
            <div className="flex items-center gap-3 px-6 py-4 bg-forest text-white rounded-full shadow-2xl shadow-forest/30">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path d="M6 6h15l-1.5 9h-12z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="20" r="1.5" fill="currentColor"/>
                <circle cx="18" cy="20" r="1.5" fill="currentColor"/>
              </svg>
              <span className="font-semibold">{cart.length} item</span>
              <span className="text-white/60">|</span>
              <span className="font-semibold">
                {formatPrice(cart.reduce((sum, item) => sum + item.price, 0))}
              </span>
            </div>
          </div>
        )}

        {/* Menu grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              data-index={index}
              className={`menu-item card-hover group relative bg-white rounded-3xl overflow-hidden border border-kave-100 ${
                visibleItems.includes(index) ? 'animate-reveal-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                
                {/* Price tag */}
                <div className="absolute top-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full font-semibold text-forest text-sm shadow-lg">
                  {formatPrice(item.price)}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-espresso mb-2 group-hover:text-forest transition-colors duration-300">
                  {item.name}
                </h3>
                <p className="text-kave-600 text-sm leading-relaxed mb-4">
                  {item.description}
                </p>
                
                <button
                  onClick={() => addToCart(item)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-kave-50 text-forest rounded-xl font-semibold hover:bg-forest hover:text-white transition-all duration-300 group/btn"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>Tambah ke Keranjang</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View all button */}
        <div className="text-center mt-12">
          <a
            href="#"
            className="inline-flex items-center gap-2 text-forest font-semibold hover:gap-4 transition-all duration-300"
          >
            <span>Lihat Menu Lengkap</span>
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

export default MenuPreview