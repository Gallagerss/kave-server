import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PricingPage = () => {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const handleGoogleLogin = (e) => {
    e.preventDefault()
    if(email) {
      alert(`Terima kasih! Akun ${email} terdaftar.`);
      navigate('/');
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-cream px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-espresso mb-4">Buat Website Impian Anda</h1>
        <p className="text-kave-600 text-lg mb-12 max-w-2xl mx-auto">Ingin memiliki sistem kasir dan website sekeren Kave untuk bisnis Anda?</p>
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-kave-100 hover-lift text-left">
            <span className="text-xs font-bold text-forest bg-forest/10 px-3 py-1 rounded-full">STARTER</span>
            <h3 className="font-display text-2xl font-bold text-espresso mt-4 mb-2">Website Basic</h3>
            <p className="text-4xl font-bold text-espresso mb-6">IDR 500K<span className="text-sm font-normal text-kave-400">/bln</span></p>
            <ul className="space-y-3 text-kave-600 text-sm mb-8">
              <li className="flex items-center gap-2"><svg className="w-4 h-4 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>Landing Page Responsif</li>
              <li className="flex items-center gap-2"><svg className="w-4 h-4 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>Desain Earthy Custom</li>
            </ul>
            <button onClick={() => setShowModal(true)} className="w-full py-3 border-2 border-forest text-forest rounded-xl font-bold hover:bg-forest hover:text-white transition-colors">Pilih Paket</button>
          </div>
          <div className="bg-forest p-8 rounded-3xl shadow-xl text-left transform scale-105 border-4 border-gold">
            <span className="text-xs font-bold text-espresso bg-gold px-3 py-1 rounded-full">BEST VALUE</span>
            <h3 className="font-display text-2xl font-bold text-white mt-4 mb-2">Full System POS</h3>
            <p className="text-4xl font-bold text-white mb-6">IDR 1.5Jt<span className="text-sm font-normal text-white/60">/bln</span></p>
            <ul className="space-y-3 text-white/80 text-sm mb-8">
              <li className="flex items-center gap-2"><svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>Semua Fitur Basic</li>
              <li className="flex items-center gap-2"><svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>Sistem Kasir & Inventory</li>
              <li className="flex items-center gap-2"><svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>Laporan Penjualan & Laba</li>
            </ul>
            <button onClick={() => setShowModal(true)} className="w-full py-3 bg-gold text-espresso rounded-xl font-bold hover:bg-yellow-400 transition-colors shadow-lg">Pilih Paket</button>
          </div>
        </div>
      </div>
      {/* Modal omitted for brevity, logic same as before */}
    </div>
  )
}

export default PricingPage