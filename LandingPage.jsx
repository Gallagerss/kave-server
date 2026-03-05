import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section id="beranda" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FDFBF7] via-[#F0E6D8] to-[#E0CCB0]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-forest/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="animate-fade-up"><span className="inline-block px-4 py-2 mb-6 text-sm font-semibold text-forest bg-forest/10 rounded-full border border-forest/20">Sistem Manajemen Kafe Terpadu</span></div>
          <h1 className="animate-fade-up delay-100 font-display text-5xl sm:text-7xl lg:text-8xl font-bold text-espresso leading-tight tracking-tight mb-6">
            Keselarasan Rasa<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-forest to-emerald-600">Dalam Setiap Cangkir</span>
          </h1>
          <p className="animate-fade-up delay-200 max-w-2xl mx-auto text-lg sm:text-xl text-kave-600 mb-10 leading-relaxed">Dari biji hingga cangkir, Kave hadir untuk mencatat setiap cerita bisnis Anda dengan harmonis.</p>
          <div className="animate-fade-up delay-300 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/menu" className="btn-earthy group px-8 py-4 bg-forest text-white rounded-full font-bold text-lg flex items-center gap-3">
              <span>Mulai Memesan</span>
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <a href="#tentang" className="px-8 py-4 text-espresso font-semibold hover:text-forest transition-colors flex items-center gap-2">Pelajari Lebih Lanjut<svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg></a>
          </div>
        </div>
      </section>

      {/* Tentang Kami Section */}
      <section id="tentang" className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-espresso">Tidak Hanya Sekadar Sistem</h2>
              <p className="text-lg text-kave-600 leading-relaxed">Kave lahir dari keinginan untuk menciptakan ekosistem kafe yang utuh. Nuansa earthy dan antarmuka yang bersahabat.</p>
              <ul className="space-y-4">
                {["Desain minimalis & fokus pada fungsi", "Keamanan data terjamin", "Dukungan 24/7"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-espresso font-medium">
                    <span className="w-6 h-6 rounded-full bg-forest/10 text-forest flex items-center justify-center"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-forest to-gold rounded-3xl transform rotate-3 opacity-20 blur-xl"></div>
              <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Interior Kafe" className="relative rounded-3xl shadow-2xl border-4 border-white hover-lift"/>
            </div>
          </div>
        </div>
      </section>

      {/* Testimoni Section */}
      <section id="testimoni" className="py-24 bg-[#F0E6D8]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-espresso mb-4">Kata Mereka Tentang Kave</h2>
            <p className="text-kave-500">Bergabung dengan ratusan kafe.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[ { name: "Rina Kusuma", role: "Owner Kopi Nusantara", quote: "Kave membantu saya mengelola cabang dengan mudah.", avatar: "RK" }, { name: "Budi Santoso", role: "Barista", quote: "Tidak perlu pusing hitung manual lagi.", avatar: "BS" }, { name: "Anita Dewi", role: "Customer", quote: "Pesan kopi jadi seamless.", avatar: "AD" } ].map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm hover-lift border border-kave-100">
                <div className="flex gap-1 mb-4">{[...Array(5)].map((_, i) => ( <svg key={i} className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg> ))}</div>
                <p className="text-kave-600 mb-6 italic">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-forest text-white flex items-center justify-center font-bold text-sm">{t.avatar}</div>
                  <div><h4 className="font-bold text-espresso">{t.name}</h4><p className="text-sm text-kave-500">{t.role}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-forest text-white text-center relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h2 className="font-display text-4xl lg:text-5xl font-bold mb-6">Siap Membawa Kafe Anda ke Level Berikutnya?</h2>
          <p className="text-lg text-white/70 mb-10">Bergabunglah dengan ekosistem Kave.</p>
          <Link to="/pricing" className="inline-block px-10 py-5 bg-gold text-espresso rounded-full font-bold text-lg hover:bg-yellow-400 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">Daftar Sekarang</Link>
        </div>
      </section>

      {/* FOOTER - UPDATED WITH INSTAGRAM */}
      <footer className="bg-espresso text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-forest rounded-xl flex items-center justify-center"><svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-gold"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                <span className="font-display text-2xl font-bold">Kave</span>
              </div>
              <p className="text-kave-300 text-sm leading-relaxed">Menghubungkan cita rasa tradisional dengan kemudahan teknologi modern.</p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div><h4 className="font-bold text-gold mb-4">Menu</h4><ul className="space-y-2 text-sm text-kave-300"><li><a href="#beranda" className="hover:text-white transition-colors">Beranda</a></li><li><a href="#tentang" className="hover:text-white transition-colors">Tentang</a></li><li><Link to="/menu" className="hover:text-white transition-colors">Menu</Link></li></ul></div>
              <div><h4 className="font-bold text-gold mb-4">Bantuan</h4><ul className="space-y-2 text-sm text-kave-300"><li><Link to="/feedback" className="hover:text-white transition-colors">FAQ / Opini</Link></li></ul></div>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-gold mb-2">Kontak Kami</h4>
              <div className="flex items-start gap-3 text-sm text-kave-300">
                <svg className="w-5 h-5 mt-0.5 text-forest flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>Jl. Soekarno-Hatta No.KM. 10, Jatisari, Buahbatu, Bandung</span>
              </div>
              {/* GANTI WHATSAPP JADI INSTAGRAM */}
              <div className="flex items-center gap-3 text-sm text-kave-300">
                <svg className="w-5 h-5 text-forest" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                <a href="https://instagram.com/kave_haus" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">@kave_haus</a>
              </div>
              {/* GANTI TOMBOL SOSMED JADI INSTAGRAM */}
              <div className="flex gap-3 pt-4">
                <a href="https://instagram.com/kave_haus" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-forest transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-xs text-kave-400"><p>&copy; {new Date().getFullYear()} Kave. All rights reserved.</p></div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage