import { Link, useLocation } from 'react-router-dom'
import { useAppState } from '../context/AppContext'
import { useState, useEffect } from 'react'

const Navbar = () => {
  const { user, logout } = useAppState()
  const location = useLocation()
  const [activeId, setActiveId] = useState('beranda')

  const navLinks = [
    { name: 'Beranda', path: '/#beranda', id: 'beranda' },
    { name: 'Tentang Kami', path: '/#tentang', id: 'tentang' },
    { name: 'Testimoni', path: '/#testimoni', id: 'testimoni' },
  ]

  const getDashboardLink = () => {
    if (!user) return { name: 'Login', path: '/login' }
    if (user.role === 'owner') return { name: 'Dashboard Owner', path: '/owner' }
    if (user.role === 'cashier') return { name: 'Panel Kasir', path: '/kasir' }
    return { name: 'Menu', path: '/menu' }
  }

  useEffect(() => {
    if (location.pathname !== '/') return;
    const handleScroll = () => {
      const sections = ['beranda', 'tentang', 'testimoni'];
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          if (scrollPosition >= element.offsetTop && scrollPosition < element.offsetTop + element.offsetHeight) {
            setActiveId(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const activeIndex = navLinks.findIndex(link => link.id === activeId);
  const handleNavClick = (e, link) => {
    if (location.pathname === '/' && link.id === 'beranda') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveId('beranda');
    }
  };
  const isMenuPage = location.pathname === '/menu';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav h-20 flex items-center justify-between px-6 lg:px-12">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="relative w-10 h-10 bg-forest rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white">
            <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="font-display text-2xl font-bold text-espresso tracking-tight hidden sm:block">Kave</span>
      </Link>

      <div className={`hidden md:flex items-center relative bg-white/50 backdrop-blur-sm p-1 rounded-full border border-kave-100 ${isMenuPage ? 'invisible' : ''}`}>
        {location.pathname === '/' && (
          <div className="absolute top-1 bottom-1 bg-forest rounded-full shadow-sm transition-all duration-300 ease-in-out" style={{ width: `calc(${100 / navLinks.length}% - 4px)`, left: `calc(${activeIndex * (100 / navLinks.length)}% + 2px)` }} />
        )}
        {navLinks.map((link) => {
          const isActive = activeId === link.id && location.pathname === '/';
          return (
            <a key={link.name} href={link.path} onClick={(e) => handleNavClick(e, link)} className={`relative z-10 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${isActive ? 'text-white' : 'text-kave-600 hover:text-espresso'}`}>
              {link.name}
            </a>
          )
        })}
      </div>

      <div className={`items-center gap-3 ${isMenuPage ? 'hidden' : 'flex'}`}>
        {(!user || (user.role !== 'owner' && user.role !== 'cashier')) ? (
           <Link to="/menu" className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-forest border border-forest/30 rounded-full hover:bg-forest hover:text-white transition-all duration-300">Lihat Menu</Link>
        ) : null}
        {user ? (
          <div className="flex items-center gap-2">
             {(user.role === 'owner' || user.role === 'cashier') && (
               <Link to={getDashboardLink().path} className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gold border border-gold/30 rounded-full hover:bg-gold hover:text-espresso transition-all duration-300">{getDashboardLink().name}</Link>
             )}
            <div className="hidden sm:block text-right"><p className="text-xs text-kave-400">Halo,</p><p className="text-sm font-bold text-espresso leading-none">{user.name}</p></div>
            <button onClick={logout} className="p-2 text-kave-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Logout">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn-earthy px-5 py-2 bg-gold text-espresso rounded-full font-bold text-sm shadow-sm hover:bg-yellow-400">Admin Login</Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar