import { useState } from 'react'
import { useAppState } from '../context/AppContext'

const CustomerMenu = () => {
  const { products, cart, addToCart, updateCartQuantity, checkout, user } = useAppState()
  const [showCart, setShowCart] = useState(false)
  const [toast, setToast] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentStep, setPaymentStep] = useState('select')
  const [orderCounts, setOrderCounts] = useState({});

  const getAvailableStock = (product) => {
    const inCart = cart.find(i => i.id === product.id);
    return product.stock - (inCart ? inCart.qty : 0);
  };

  const handleCountChange = (productId, type) => {
    const product = products.find(p => p.id === productId);
    const availableStock = getAvailableStock(product);
    const currentCount = orderCounts[productId] || 0;

    setOrderCounts(prev => {
      if (type === 'inc') {
        if (currentCount >= availableStock) { setToast("Stok tidak mencukupi!"); setTimeout(() => setToast(null), 2000); return prev; }
        return { ...prev, [productId]: currentCount + 1 };
      }
      if (type === 'dec' && currentCount > 0) return { ...prev, [productId]: currentCount - 1 };
      return prev;
    });
  };

  const handleAddToCart = (product) => {
    const qty = orderCounts[product.id] || 0;
    if (qty === 0) { setToast("Pilih jumlah dulu!"); setTimeout(() => setToast(null), 2000); return; }
    if (qty > getAvailableStock(product)) { setToast("Melebihi stok!"); setTimeout(() => setToast(null), 2000); return; }

    const existingItem = cart.find(item => item.id === product.id);
    const newQty = existingItem ? existingItem.qty + qty : qty;
    if (existingItem) { updateCartQuantity(product.id, newQty); }
    else { if (newQty > 0) { addToCart(product); if (newQty > 1) updateCartQuantity(product.id, newQty); } }

    setToast(`${qty}x ${product.name} ditambahkan!`);
    setOrderCounts(prev => ({ ...prev, [product.id]: 0 })); 
    setTimeout(() => setToast(null), 2000);
  }

  const handleCheckoutInit = () => { setShowPaymentModal(true); setPaymentStep('select'); }
  const handlePaymentConfirm = (method) => {
    if (method === 'cash') { const result = checkout('cash'); if (result.success) { setShowPaymentModal(false); setShowCart(false); setToast(`Pesanan #${result.orderId} berhasil!`); } }
    else if (method === 'qris') { setPaymentStep('qris_scan'); }
  }
  const handleQrisPay = () => { const result = checkout('qris'); if (result.success) { setShowPaymentModal(false); setShowCart(false); setToast(`Pembayaran QRIS #${result.orderId} Sukses!`); } }

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0)

  return (
    <div className="min-h-screen pt-20 bg-[#FDFBF7]">
      <div className="sticky top-20 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-kave-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div><h1 className="font-display text-3xl sm:text-4xl font-bold text-espresso">Menu Hari Ini</h1><p className="text-kave-500 text-sm mt-1">Halo {user?.name || 'Tamu'}</p></div>
            <button onClick={() => setShowCart(!showCart)} className="relative p-4 bg-white rounded-2xl shadow-lg group">
              <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-forest"><path d="M6 6h15l-1.5 9h-12z" stroke="currentColor" strokeWidth="1.5"/><circle cx="9" cy="20" r="1.5" fill="currentColor"/><circle cx="18" cy="20" r="1.5" fill="currentColor"/></svg>
              {cart.length > 0 && (<span className="absolute -top-2 -right-2 w-6 h-6 bg-gold text-white text-xs rounded-full flex items-center justify-center font-bold animate-bounce">{cart.reduce((s, i) => s + i.qty, 0)}</span>)}
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-10 pb-20">
        <div className="max-w-7xl mx-auto">
          {toast && (<div className="fixed top-28 left-1/2 -translate-x-1/2 bg-forest text-white px-8 py-4 rounded-full shadow-xl z-50 animate-fade-up flex items-center gap-3"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>{toast}</div>)}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => {
              const currentCount = orderCounts[product.id] || 0;
              const inCart = cart.find(i => i.id === product.id);
              const availableStock = getAvailableStock(product);
              return (
              <div key={product.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover-lift border flex flex-col">
                <div className="h-48 overflow-hidden relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                  {product.stock === 0 && (<div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-white font-bold text-lg bg-red-500 px-4 py-1 rounded-full">Habis</span></div>)}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-display text-xl font-bold text-espresso">{product.name}</h3>
                  <p className="text-sm text-kave-400 mb-3 line-clamp-2 h-10">{product.description || "-"}</p>
                  <div className="mt-auto flex justify-between items-center pt-4 border-t border-dashed border-kave-100 mb-4">
                    <span className="text-xl font-bold text-forest">Rp {product.price.toLocaleString('id-ID')}</span>
                    <span className="text-xs text-kave-400">Stok: {product.stock}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-kave-50 rounded-lg overflow-hidden border">
                      <button onClick={() => handleCountChange(product.id, 'dec')} className="px-3 py-2 text-forest font-bold hover:bg-kave-100 text-lg">-</button>
                      <span className="px-4 py-2 text-espresso font-bold min-w-[40px] text-center bg-white">{currentCount}</span>
                      <button onClick={() => handleCountChange(product.id, 'inc')} disabled={product.stock === 0 || currentCount >= availableStock} className={`px-3 py-2 font-bold text-lg ${(product.stock === 0 || currentCount >= availableStock) ? 'text-kave-200 cursor-not-allowed' : 'text-forest hover:bg-kave-100'}`}>+</button>
                    </div>
                    <button onClick={() => handleAddToCart(product)} disabled={product.stock === 0 || currentCount === 0} className="btn-earthy flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-forest text-white rounded-lg text-sm font-semibold disabled:bg-gray-300">Tambah</button>
                  </div>
                  {inCart && <p className="text-xs text-center text-forest mt-2 font-semibold">Di keranjang: {inCart.qty}</p>}
                </div>
              </div>
            )})}
          </div>
        </div>
      </div>

      {/* Cart & Payment Modal sama seperti sebelumnya */}
      {showCart && (
        <div className="fixed inset-0 z-50"><div className="absolute inset-0 bg-espresso/30 backdrop-blur-sm" onClick={() => setShowCart(false)}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-fade-up">
            <div className="p-6 border-b border-kave-100 flex justify-between items-center"><h2 className="font-display text-2xl font-bold text-espresso">Keranjang</h2><button onClick={() => setShowCart(false)} className="p-2 hover:bg-kave-50 rounded-full"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button></div>
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (<div className="text-center py-16"><p className="text-kave-400">Keranjang kosong</p></div>) : (
                <div className="space-y-6">{cart.map(item => (
                  <div key={item.id} className="flex items-center gap-4 bg-[#FDFBF7] p-4 rounded-2xl">
                    <img src={item.image} className="w-16 h-16 rounded-xl object-cover"/>
                    <div className="flex-1"><h4 className="font-bold text-espresso">{item.name}</h4><p className="text-sm text-kave-500">Rp {item.price.toLocaleString('id-ID')}</p></div>
                    <div className="flex items-center border rounded-lg overflow-hidden">
                      <button onClick={() => updateCartQuantity(item.id, item.qty - 1)} className="px-2 py-1 text-red-500 hover:bg-red-50 font-bold">-</button>
                      <span className="px-2 py-1 font-bold">{item.qty}</span>
                      <button onClick={() => updateCartQuantity(item.id, item.qty + 1)} className="px-2 py-1 text-forest hover:bg-forest/10 font-bold">+</button>
                    </div>
                  </div>
                ))}</div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-6 bg-forest text-white rounded-t-3xl shadow-2xl">
                <div className="flex justify-between text-lg mb-4"><span>Total</span><span className="font-bold text-xl">Rp {totalPrice.toLocaleString('id-ID')}</span></div>
                <button onClick={handleCheckoutInit} className="w-full py-4 bg-gold text-espresso rounded-xl font-bold text-lg hover:bg-yellow-400 transition-colors">Lanjut Bayar</button>
              </div>
            )}
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-espresso/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl animate-fade-up relative">
            <button onClick={() => { setShowPaymentModal(false); setPaymentStep('select'); }} className="absolute top-4 right-4 text-kave-400 hover:text-espresso"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            {paymentStep === 'select' && (
              <><h3 className="font-display text-2xl font-bold text-espresso mb-6 text-center">Pilih Metode Pembayaran</h3><div className="space-y-4">
                <button onClick={() => handlePaymentConfirm('cash')} className="w-full p-4 border-2 border-kave-100 rounded-xl hover:border-forest hover:bg-forest/5 transition-all flex items-center gap-4 group"><div className="w-12 h-12 bg-forest/10 rounded-full flex items-center justify-center text-forest"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg></div><div className="text-left"><h4 className="font-bold text-espresso group-hover:text-forest">Tunai (Cash)</h4><p className="text-sm text-kave-500">Bayar langsung di kasir</p></div></button>
                <button onClick={() => handlePaymentConfirm('qris')} className="w-full p-4 border-2 border-kave-100 rounded-xl hover:border-gold hover:bg-gold/5 transition-all flex items-center gap-4 group"><div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center text-gold"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg></div><div className="text-left"><h4 className="font-bold text-espresso group-hover:text-gold">QRIS</h4><p className="text-sm text-kave-500">Scan QR untuk membayar</p></div></button>
              </div></>
            )}
            {paymentStep === 'qris_scan' && (
              <div className="text-center"><h3 className="font-display text-2xl font-bold text-espresso mb-4">Scan QRIS</h3><p className="text-kave-500 text-sm mb-6">Gunakan aplikasi e-wallet Anda</p><div className="bg-white p-4 rounded-2xl inline-block border border-kave-200 shadow-inner mb-6"><img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=KavePayment" alt="QR Code" className="w-48 h-48 mx-auto"/></div><p className="text-2xl font-bold text-espresso mb-6">Total: <span className="text-forest">Rp {totalPrice.toLocaleString('id-ID')}</span></p><button onClick={handleQrisPay} className="btn-earthy w-full py-4 bg-forest text-white rounded-xl font-bold text-lg hover:bg-espresso transition-colors shadow-lg flex items-center justify-center gap-2"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Bayar Sekarang</button></div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerMenu