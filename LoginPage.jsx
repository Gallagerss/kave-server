import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppState } from '../context/AppContext'

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAppState()
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    const result = login(username, password)
    if (result.success) {
      // Hanya bisa Owner atau Kasir
      if (result.role === 'owner') navigate('/owner')
      else if (result.role === 'cashier') navigate('/kasir')
      else navigate('/') // Fallback jika ternyata role lain
    } else {
      setError(result.message)
      setTimeout(() => setError(''), 3000)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 font-body">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-col justify-between bg-forest p-12 text-white relative overflow-hidden">
        {/* ... (Kode bagian kiri sama persis) ... */}
         <div>
          <Link to="/" className="font-display text-3xl font-bold tracking-tight">Kave.</Link>
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl lg:text-5xl font-display font-bold leading-tight mb-4">
            Panel Admin Kave
          </h1>
          <p className="text-lg text-white/70">
            Akses khusus untuk Owner dan Kasir.
          </p>
        </div>
        <div className="flex items-center gap-4">
           {/* ... (decorative) ... */}
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-col justify-center items-center p-8 bg-[#FDFBF7] relative">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden text-center">
             <Link to="/" className="font-display text-3xl font-bold text-espresso">Kave.</Link>
          </div>
          
          <h2 className="font-display text-3xl font-bold text-espresso mb-2">Login Admin</h2>
          <p className="text-kave-500 mb-8">Silakan masuk untuk mengakses dashboard.</p>

          {error && <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-sm">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-espresso mb-2">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-5 py-4 bg-white border-2 border-kave-100 rounded-xl focus:border-forest focus:ring-0 outline-none transition-colors" placeholder="Username"/>
            </div>
            <div>
              <label className="block text-sm font-semibold text-espresso mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-5 py-4 bg-white border-2 border-kave-100 rounded-xl focus:border-forest focus:ring-0 outline-none transition-colors" placeholder="Password"/>
            </div>
            <button type="submit" className="btn-earthy w-full py-4 bg-forest text-white rounded-xl font-bold text-lg shadow-md hover:bg-espresso">Masuk</button>
          </form>

          <div className="mt-10 pt-8 border-t border-kave-100">
            <p className="text-xs text-center text-kave-400 mb-3">Demo Akun Admin:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { user: 'kasir', pass: 'kasir123', role: 'Kasir', color: 'bg-blue-100 text-blue-800' },
                { user: 'owner', pass: 'owner123', role: 'Owner', color: 'bg-amber-100 text-amber-800' },
              ].map((acc) => (
                <button key={acc.user} onClick={() => { setUsername(acc.user); setPassword(acc.pass); }} className={`px-3 py-1 rounded-full text-xs font-semibold ${acc.color} hover:opacity-80 transition-opacity`}>
                  {acc.role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage