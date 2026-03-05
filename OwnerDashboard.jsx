import { useState, useMemo } from 'react'
import { useAppState } from '../context/AppContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const OwnerDashboard = () => {
  const { orders, products, user, addProduct, updateProduct, deleteProduct, deleteOrder } = useAppState()
  const [view, setView] = useState('dashboard')
  const [filter, setFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [editProd, setEditProd] = useState(null)
  const [prodForm, setProdForm] = useState({ name: '', price: '', cost: '', stock: '', description: '', image: '', category: 'coffee' })

  const filteredOrders = useMemo(() => {
    const now = new Date();
    return orders.filter(o => {
      const date = new Date(o.createdAt);
      let timeMatch = true;
      if (filter === 'today') timeMatch = date.toDateString() === now.toDateString();
      else if (filter === 'month') timeMatch = date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      else if (filter === 'year') timeMatch = date.getFullYear() === now.getFullYear();
      let paymentMatch = true;
      if (paymentFilter !== 'all') paymentMatch = o.paymentMethod === paymentFilter;
      return timeMatch && paymentMatch;
    });
  }, [orders, filter, paymentFilter]);

  const stats = useMemo(() => {
    const completed = filteredOrders.filter(o => o.status === 'completed' || o.status === 'processing');
    return { 
      grossProfit: completed.reduce((sum, o) => sum + o.total, 0), 
      netProfit: completed.reduce((sum, o) => sum + (o.profit || 0), 0), 
      totalOrders: completed.length 
    };
  }, [filteredOrders]);

  const chartData = useMemo(() => {
    const days = [...Array(7)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - i); return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }); }).reverse();
    return days.map(day => { const dayOrders = orders.filter(o => new Date(o.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) === day); return { name: day, Omzet: dayOrders.reduce((s, o) => s + o.total, 0), Laba: dayOrders.reduce((s, o) => s + (o.profit || 0), 0) }; });
  }, [orders]);

  const downloadReport = () => {
    const headers = ["Order ID", "Date", "Customer", "Items", "Total", "Profit", "Payment", "Status"];
    const rows = filteredOrders.map(o => [o.id, new Date(o.createdAt).toLocaleString('id-ID'), o.customerName, `"${o.items.map(i => `${i.name}(${i.qty})`).join(', ')}"`, o.total, o.profit || 0, o.paymentMethod, o.status]);
    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const link = document.createElement("a"); link.setAttribute("href", encodeURI(csvContent)); link.setAttribute("download", "Laporan_Kave.csv"); document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const payload = { ...prodForm, price: Number(prodForm.price), cost: Number(prodForm.cost || 0), stock: Number(prodForm.stock), description: prodForm.description, image: prodForm.image || 'https://via.placeholder.com/400' };
    if (editProd) updateProduct({ ...payload, id: editProd.id }); else addProduct(payload);
    resetForm();
  };

  const resetForm = () => { setEditProd(null); setProdForm({ name: '', price: '', cost: '', stock: '', description: '', image: '', category: 'coffee' }); setView('products'); }

  return (
    <div className="min-h-screen pt-24 pb-10 px-6 lg:px-8 bg-cream">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div><h1 className="font-display text-3xl font-bold text-espresso">Owner Dashboard</h1><p className="text-kave-500">Selamat datang, {user?.name}</p></div>
          <div className="flex bg-white rounded-xl p-1 border border-kave-200 shadow-sm">
            {[ { id: 'dashboard', label: 'Laporan' }, { id: 'products', label: 'Produk' }, { id: 'history', label: 'Riwayat' } ].map(t => (
              <button key={t.id} onClick={() => setView(t.id)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${view === t.id ? 'bg-forest text-white' : 'text-kave-600 hover:bg-kave-50'}`}>{t.label}</button>
            ))}
          </div>
        </div>

        {view === 'dashboard' && ( <> <div className="grid sm:grid-cols-3 gap-6 mb-8"> <div className="bg-white p-6 rounded-2xl border shadow-sm"><p className="text-sm text-kave-500 mb-1">Laba Kotor</p><h2 className="font-display text-2xl font-bold text-forest">Rp {stats.grossProfit.toLocaleString('id-ID')}</h2></div> <div className="bg-white p-6 rounded-2xl border shadow-sm"><p className="text-sm text-kave-500 mb-1">Laba Bersih</p><h2 className="font-display text-2xl font-bold text-gold">Rp {stats.netProfit.toLocaleString('id-ID')}</h2></div> <div className="bg-white p-6 rounded-2xl border shadow-sm"><p className="text-sm text-kave-500 mb-1">Total Pesanan</p><h2 className="font-display text-2xl font-bold text-espresso">{stats.totalOrders}</h2></div> </div> <div className="bg-white p-6 rounded-2xl border shadow-sm mb-8"> <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-espresso">Grafik</h3><button onClick={downloadReport} className="px-4 py-2 bg-forest text-white rounded-lg text-sm font-semibold">Download CSV</button></div> <div className="h-72"> <ResponsiveContainer width="100%" height="100%"> <BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} /><Bar dataKey="Omzet" fill="#C9A962" radius={[4, 4, 0, 0]} /><Bar dataKey="Laba" fill="#2D4A3E" radius={[4, 4, 0, 0]} /></BarChart> </ResponsiveContainer> </div> </div> </> )}

        {view === 'products' && ( <div className="grid lg:grid-cols-3 gap-8"> <div className="lg:col-span-1 bg-white p-6 rounded-2xl border h-fit sticky top-24 shadow-sm"> <h3 className="font-bold text-espresso mb-4">{editProd ? 'Edit Produk' : 'Tambah Produk'}</h3> <form onSubmit={handleSaveProduct} className="space-y-4"> <input type="text" placeholder="Nama" value={prodForm.name} onChange={e => setProdForm({...prodForm, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest outline-none" required /> <textarea placeholder="Deskripsi" value={prodForm.description} onChange={e => setProdForm({...prodForm, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest outline-none h-24 resize-none" /> <div className="grid grid-cols-2 gap-4"> <input type="number" placeholder="Harga Jual" value={prodForm.price} onChange={e => setProdForm({...prodForm, price: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest outline-none" required /> <input type="number" placeholder="Modal" value={prodForm.cost} onChange={e => setProdForm({...prodForm, cost: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest outline-none" required /> </div> <input type="number" placeholder="Stok" value={prodForm.stock} onChange={e => setProdForm({...prodForm, stock: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest outline-none" required /> <input type="text" placeholder="URL Gambar" value={prodForm.image} onChange={e => setProdForm({...prodForm, image: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-forest outline-none" /> <button type="submit" className="w-full bg-forest text-white py-2 rounded-lg font-semibold hover:bg-espresso transition-colors">Simpan</button> {editProd && <button type="button" onClick={resetForm} className="w-full bg-red-50 text-red-500 py-2 rounded-lg font-semibold">Batal</button>} </form> </div> <div className="lg:col-span-2 space-y-4"> {products.map(p => ( <div key={p.id} className="flex items-center gap-4 bg-white p-4 rounded-xl border shadow-sm hover-lift"> <img src={p.image} className="w-16 h-16 rounded-lg object-cover"/> <div className="flex-1"> <h4 className="font-bold text-espresso">{p.name}</h4> <p className="text-xs text-kave-400 truncate">{p.description || '-'}</p> <p className="text-sm text-kave-500">Jual: {p.price.toLocaleString('id-ID')} | Stok: {p.stock}</p> </div> <div className="flex gap-2"> <button onClick={() => { setEditProd(p); setProdForm(p); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button> <button onClick={() => deleteProduct(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button> </div> </div> ))} </div> </div> )}

        {view === 'history' && (
          <div className="bg-white rounded-2xl p-6 border border-kave-100 shadow-sm">
             <div className="flex flex-wrap gap-2 mb-6 border-b border-kave-100 pb-4">
              <div className="flex flex-wrap gap-2">
                {[ { id: 'all', label: 'Semua Waktu' }, { id: 'today', label: 'Hari Ini' }, { id: 'month', label: 'Bulan Ini' } ].map(f => ( <button key={f.id} onClick={() => setFilter(f.id)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === f.id ? 'bg-forest text-white' : 'bg-kave-50 text-kave-600 hover:bg-kave-100'}`}>{f.label}</button> ))}
              </div>
              <div className="flex flex-wrap gap-2 ml-auto">
                 {[ { id: 'all', label: 'Semua Metode' }, { id: 'cash', label: 'Cash' }, { id: 'qris', label: 'QRIS' } ].map(p => ( <button key={p.id} onClick={() => setPaymentFilter(p.id)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${paymentFilter === p.id ? 'bg-gold text-espresso' : 'bg-kave-50 text-kave-600 hover:bg-kave-100'}`}>{p.label}</button> ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead><tr className="border-b border-kave-100 text-kave-500"><th className="pb-3 font-semibold">ID</th><th className="pb-3 font-semibold">Waktu</th><th className="pb-3 font-semibold">Customer</th><th className="pb-3 font-semibold">Total</th><th className="pb-3 font-semibold">Metode</th><th className="pb-3 font-semibold">Status</th><th className="pb-3 font-semibold text-center">Aksi</th></tr></thead>
                <tbody>
                  {filteredOrders.map(o => (
                    <tr key={o.id} className="border-b border-kave-50 hover:bg-cream/30">
                      <td className="py-3 font-medium">#{o.id}</td>
                      <td className="py-3">{new Date(o.createdAt).toLocaleString('id-ID')}</td>
                      <td className="py-3">{o.customerName}</td>
                      <td className="py-3 font-semibold">Rp {o.total.toLocaleString('id-ID')}</td>
                      <td className="py-3 uppercase text-xs font-bold">{o.paymentMethod}</td>
                      <td className="py-3"><span className={`px-2 py-1 rounded-full text-xs font-bold ${ o.status === 'completed' ? 'bg-green-100 text-green-700' : o.status === 'processing' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700' }`}>{o.status}</span></td>
                      <td className="py-3 text-center">
                        <button onClick={() => deleteOrder(o.id)} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Hapus Riwayat"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OwnerDashboard