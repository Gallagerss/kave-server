import { useState } from 'react'
import { useAppState } from '../context/AppContext'
import { Link } from 'react-router-dom'

const FeedbackPage = () => {
  const { addFeedback } = useAppState()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if(form.name && form.message) {
      addFeedback(form)
      setSuccess(true)
      setForm({ name: '', email: '', message: '' })
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#FDFBF7]">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-espresso mb-2">FAQ & Opini</h1>
          <p className="text-kave-500">Sampaikan pertanyaan atau saran Anda.</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-kave-100">
          {success && (<div className="mb-6 p-4 bg-forest/10 text-forest rounded-xl text-center font-semibold animate-fade-up">Terima kasih! Opini Anda telah terkirim.</div>)}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div><label className="block text-sm font-semibold text-espresso mb-2">Nama Lengkap</label><input type="text" required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 border border-kave-200 rounded-xl focus:ring-2 focus:ring-forest outline-none transition-all" placeholder="Nama Anda"/></div>
            <div><label className="block text-sm font-semibold text-espresso mb-2">Email (Opsional)</label><input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full px-4 py-3 border border-kave-200 rounded-xl focus:ring-2 focus:ring-forest outline-none transition-all" placeholder="Email Anda"/></div>
            <div><label className="block text-sm font-semibold text-espresso mb-2">Pesan / Pertanyaan</label><textarea rows="5" required value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} className="w-full px-4 py-3 border border-kave-200 rounded-xl focus:ring-2 focus:ring-forest outline-none transition-all resize-none" placeholder="Tulis di sini..."></textarea></div>
            <button type="submit" className="btn-earthy w-full py-4 bg-forest text-white rounded-xl font-bold text-lg hover:bg-espresso transition-colors shadow-lg">Kirim Opini</button>
          </form>
        </div>
        <div className="text-center mt-8"><Link to="/" className="text-forest hover:underline font-medium">← Kembali ke Beranda</Link></div>
      </div>
    </div>
  )
}

export default FeedbackPage