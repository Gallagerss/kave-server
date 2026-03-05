import { useState, useMemo } from 'react'
import { useAppState } from '../context/AppContext'

const CashierDashboard = () => {
  const { orders, updateOrderStatus, user } = useAppState()
  const [view, setView] = useState('active')
  const [filter, setFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')

  const activeOrders = orders.filter(o => o.status !== 'completed')

  const filteredHistory = useMemo(() => {
    const now = new Date();
    return orders.filter(o => {
      const date = new Date(o.createdAt);
      let timeMatch = true;
      if (filter === 'today') timeMatch = date.toDateString() === now.toDateString();
      else if (filter === 'month') timeMatch = date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      let paymentMatch = true;
      if (paymentFilter !== 'all') paymentMatch = o.paymentMethod === paymentFilter;
      return timeMatch && paymentMatch;
    });
  }, [orders, filter, paymentFilter]);

  const statusStyles = { pending: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Menunggu' }, processing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Diproses' }, completed: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Selesai' } }

  return (
    <div className="min-h-screen pt-24 pb-10 px-4 sm:px-6 lg:px-8 bg-cream">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div><h1 className="font-display text-4xl font-bold text-espresso">Panel Kasir</h1><p className="text-kave-500 mt-1">Halo {user?.name}.</p></div>
          <div className="flex bg-white rounded-xl p-1 border border-kave-200">
            <button onClick={() => setView('active')} className={`px-4 py-2 rounded-lg text-sm font-semibold ${view === 'active' ? 'bg-forest text-white' : 'text-kave-600'}`}>Aktif</button>
            <button onClick={() => setView('history')} className={`px-4 py-2 rounded-lg text-sm font-semibold ${view === 'history' ? 'bg-forest text-white' : 'text-kave-600'}`}>Riwayat</button>
          </div>
        </div>

        {view === 'active' ? (
          <>
            {activeOrders.length === 0 ? (<div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-kave-200 text-kave-400">Tidak ada pesanan aktif.</div>) : (
              <div className="space-y-6">
                {activeOrders.map(order => (
                  <div key={order.id} className="bg-white p-6 rounded-3xl shadow-sm border border-kave-100 hover-lift">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-display text-2xl font-bold text-espresso">#{order.id}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyles[order.status]?.bg} ${statusStyles[order.status]?.text}`}>{statusStyles[order.status]?.label}</span>
                        </div>
                        <p className="text-sm text-kave-400">{new Date(order.createdAt).toLocaleString('id-ID')}</p>
                      </div>
                      <div className="flex gap-2">
                        {order.status === 'pending' && (<button onClick={() => updateOrderStatus(order.id, 'processing')} className="btn-earthy px-6 py-3 bg-blue-500 text-white rounded-xl text-sm font-semibold">Proses</button>)}
                        {order.status === 'processing' && (<button onClick={() => updateOrderStatus(order.id, 'completed')} className="btn-earthy px-6 py-3 bg-forest text-white rounded-xl text-sm font-semibold">Selesaikan</button>)}
                      </div>
                    </div>
                    <div className="border-t border-dashed border-kave-100 pt-4">
                      <div className="flex justify-between mb-2"><span className="font-semibold text-espresso">Item Pesanan:</span><span className="font-bold text-forest">Total: Rp {order.total.toLocaleString('id-ID')}</span></div>
                      <div className="grid sm:grid-cols-2 gap-2 mt-2">
                        {order.items.map(item => (<div key={item.id} className="flex justify-between text-sm text-kave-600 bg-cream px-4 py-2 rounded-lg"><span>{item.name}</span><span className="font-medium">x{item.qty}</span></div>))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="bg-white p-6 rounded-2xl border border-kave-100 shadow-sm">
            <div className="flex flex-wrap gap-2 mb-4 border-b border-kave-100 pb-4">
              <div className="flex flex-wrap gap-2">
                {[ { id: 'all', label: 'Semua Waktu' }, { id: 'today', label: 'Hari Ini' }, { id: 'month', label: 'Bulan Ini' } ].map(f => ( <button key={f.id} onClick={() => setFilter(f.id)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === f.id ? 'bg-forest text-white' : 'bg-kave-50 text-kave-600 hover:bg-kave-100'}`}>{f.label}</button> ))}
              </div>
              <div className="flex flex-wrap gap-2 ml-auto">
                 {[ { id: 'all', label: 'Semua' }, { id: 'cash', label: 'Cash' }, { id: 'qris', label: 'QRIS' } ].map(p => ( <button key={p.id} onClick={() => setPaymentFilter(p.id)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${paymentFilter === p.id ? 'bg-gold text-espresso' : 'bg-kave-50 text-kave-600 hover:bg-kave-100'}`}>{p.label}</button> ))}
              </div>
            </div>
            <div className="space-y-4">
              {filteredHistory.length === 0 ? (<p className="text-center text-kave-400 py-12">Tidak ada riwayat.</p>) : (
                filteredHistory.map(o => (
                   <div key={o.id} className="flex items-center justify-between p-4 border-b border-kave-50">
                     <div><p className="font-bold text-espresso">#{o.id} <span className="text-xs font-normal text-kave-400 ml-2">{new Date(o.createdAt).toLocaleString('id-ID')}</span></p><p className="text-sm text-kave-500">{o.items.map(i => i.name).join(', ')}</p></div>
                     <div className="text-right"><p className="font-bold text-forest">Rp {o.total.toLocaleString('id-ID')}</p><p className="text-xs text-kave-400">{o.paymentMethod?.toUpperCase()}</p></div>
                   </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CashierDashboard