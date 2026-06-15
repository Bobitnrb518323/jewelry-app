import React, { useState } from 'react';
import { Package, ClipboardList, Users, TrendingUp, DollarSign, Award, Plus, Trash2, Edit3, ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell, PieChart, Pie } from 'recharts';
import { Product, Order, Customer, OrderStatus } from '../types';
import { ShieldCheck, PlusCircle } from 'lucide-react';

interface AdminDeskProps {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  onAddProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onUpdateCustomerStatus: (customerId: string, status: 'active' | 'suspended') => void;
  onDeleteCustomer: (customerId: string) => void;
}

export default function AdminDesk({
  products,
  orders,
  customers,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onUpdateCustomerStatus,
  onDeleteCustomer
}: AdminDeskProps) {
  // Tabs management
  const [activeTab, setActiveTab] = useState<'analytics' | 'catalog' | 'orders' | 'customers'>('analytics');

  // New product form handling
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState(150000);
  const [formCategory, setFormCategory] = useState<'rings' | 'necklaces' | 'bracelets' | 'earrings'>('rings');
  const [formMaterial, setFormMaterial] = useState('18K Yellow Gold');
  const [formGemstone, setFormGemstone] = useState('Ethical Diamond');
  const [formImage, setFormImage] = useState('https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600');
  const [formCertId, setFormCertId] = useState('CERT-ETH-9901');
  const [formMine, setFormMine] = useState('Katse Mineral Cooperatives, East Africa');
  const [formStock, setFormStock] = useState(10);

  // Handle addition or update submission
  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formImage.trim()) {
      alert("Please provide a name and valid image URL.");
      return;
    }

    const draftCert = {
      certificateId: formCertId || `CERT-ETH-${Math.floor(1000 + Math.random() * 9000)}`,
      mintedAddress: `0x${Math.random().toString(16).substring(2, 42)}`,
      minedSource: formMine || "Artisanal Certified Cooperative, Kenya Geological",
      mineralPurity: formMaterial,
      weightCarat: formCategory === 'rings' ? 1.0 : 2.5,
      cutSpecification: "Excellent Ideal Cut",
      ethicallySourced: true,
      blockchainTimestamp: new Date().toISOString()
    };

    if (editingProduct) {
      onEditProduct({
        ...editingProduct,
         name: formName,
         description: formDescription,
         priceKSh: Number(formPrice),
         category: formCategory,
         material: formMaterial,
         gemstone: formGemstone,
         image: formImage,
         stock: Number(formStock),
         certificate: {
           ...editingProduct.certificate,
           certificateId: formCertId,
           minedSource: formMine
         }
       });
       setEditingProduct(null);
     } else {
       const generatedId = `JWL-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
       onAddProduct({
         id: generatedId,
         name: formName,
         description: formDescription,
         priceKSh: Number(formPrice),
         category: formCategory,
         material: formMaterial,
         gemstone: formGemstone,
         image: formImage,
         stars: 5.0,
         stock: Number(formStock),
         tryOnOffset: {
           scale: 1.0,
           rotation: 0,
           yOffset: 40,
           xOffset: 0
         },
         certificate: draftCert,
         reviews: []
       });
     }

    // Reset forms
    setShowAddForm(false);
    resetForm();
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormDescription(product.description);
    setFormPrice(product.priceKSh);
    setFormCategory(product.category);
    setFormMaterial(product.material);
    setFormGemstone(product.gemstone);
    setFormImage(product.image);
    setFormCertId(product.certificate.certificateId);
    setFormMine(product.certificate.minedSource);
    setFormStock(product.stock !== undefined ? product.stock : 10);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormName('');
    setFormDescription('');
    setFormPrice(150000);
    setFormCategory('rings');
    setFormMaterial('18K Yellow Gold');
    setFormGemstone('Ethical Diamond');
    setFormImage('https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600');
    setFormCertId('CERT-ETH-9901');
    setFormMine('Katse Mineral Cooperatives, East Africa');
    setFormStock(10);
  };

  // Aggregated analytics calculation
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalVAT = orders.reduce((sum, order) => sum + order.vat, 0);
  const averageTicket = orders.length ? (totalRevenue / orders.length) : 0;

  // Chart data: Monthly Sales Representation (Simulated)
  const salesHistory = [
    { label: 'Week 1', sales: orders.length > 2 ? totalRevenue * 0.35 : 1250000, orders: 4 },
    { label: 'Week 2', sales: orders.length > 2 ? totalRevenue * 0.42 : 1890000, orders: 5 },
    { label: 'Week 3', sales: orders.length > 2 ? totalRevenue * 0.58 : 2200000, orders: 8 },
    { label: 'Week 4', sales: totalRevenue || 3450000, orders: orders.length || 10 },
  ];

  // Chart data: Sourcing Categories Count
  const categoryChartData = [
    { name: 'Rings', value: products.filter(p => p.category === 'rings').length },
    { name: 'Necklaces', value: products.filter(p => p.category === 'necklaces').length },
    { name: 'Bracelets', value: products.filter(p => p.category === 'bracelets').length },
    { name: 'Earrings', value: products.filter(p => p.category === 'earrings').length },
  ];

  const COLORS = ['#d97706', '#059669', '#2563eb', '#9333ea'];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4" id="admin-panel">
      {/* Platform Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-neutral-200 pb-6">
        <div>
          <div className="flex items-center gap-1 text-xs text-amber-700 font-mono font-bold uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            Administrative Office
          </div>
          <h2 className="text-2xl font-serif font-bold text-neutral-900 tracking-tight">
            System Operations Panel
          </h2>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-1.5 mt-4 md:mt-0 p-1 bg-neutral-100 rounded-xl max-w-full overflow-x-auto">
          <button
            onClick={() => { setActiveTab('analytics'); setShowAddForm(false); }}
            className={`px-4 py-2 text-xs font-mono font-semibold rounded-lg transition-colors cursor-pointer ${activeTab === 'analytics' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-800'}`}
          >
            Analytics Overview
          </button>
          <button
            onClick={() => { setActiveTab('catalog'); setShowAddForm(false); }}
            className={`px-4 py-2 text-xs font-mono font-semibold rounded-lg transition-colors cursor-pointer ${activeTab === 'catalog' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-800'}`}
          >
            Product Catalog ({products.length})
          </button>
          <button
            onClick={() => { setActiveTab('orders'); setShowAddForm(false); }}
            className={`px-4 py-2 text-xs font-mono font-semibold rounded-lg transition-colors cursor-pointer ${activeTab === 'orders' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-800'}`}
          >
            Orders Monitor ({orders.length})
          </button>
          <button
            onClick={() => { setActiveTab('customers'); setShowAddForm(false); }}
            className={`px-4 py-2 text-xs font-mono font-semibold rounded-lg transition-colors cursor-pointer ${activeTab === 'customers' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-800'}`}
          >
            Manage Accounts ({customers.length})
          </button>
        </div>
      </div>

      {/* RENDER ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Key Metric Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-neutral-200/60 p-5 rounded-2xl">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Aggregate Sales Revenue</span>
              <div className="text-2xl font-serif font-black text-neutral-900 mt-1">KSh {totalRevenue.toLocaleString()}</div>
              <span className="text-[10px] font-mono text-emerald-600 mt-1 block">▲ 14.8% vs last month</span>
            </div>
            <div className="bg-white border border-neutral-200/60 p-5 rounded-2xl">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Total Orders Registered</span>
              <div className="text-2xl font-serif font-black text-neutral-900 mt-1">{orders.length}</div>
              <span className="text-[10px] font-mono text-neutral-500 mt-1 block">Full legal auditing trail</span>
            </div>
            <div className="bg-white border border-neutral-200/60 p-5 rounded-2xl">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Average Transaction Value</span>
              <div className="text-2xl font-serif font-black text-neutral-900 mt-1">KSh {Math.round(averageTicket).toLocaleString()}</div>
              <span className="text-[10px] font-mono text-amber-600 mt-1 block">High ticket luxury segment</span>
            </div>
            <div className="bg-white border border-neutral-200/60 p-5 rounded-2xl">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Collected VAT (16% Kenya)</span>
              <div className="text-2xl font-serif font-black text-neutral-900 mt-1">KSh {Math.round(totalVAT).toLocaleString()}</div>
              <span className="text-[10px] font-mono text-neutral-500 mt-1 block">Audited automatically on-chain</span>
            </div>
          </div>

          {/* Charts Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-neutral-200/60 p-6 rounded-2xl">
              <h3 className="text-sm font-serif font-bold text-neutral-900 mb-4 uppercase tracking-wider">Weekly Revenue Growth</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesHistory}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d97706" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="label" stroke="#888888" fontSize={11} fontClassName="font-mono" />
                    <YAxis stroke="#888888" fontSize={11} />
                    <Tooltip formatter={(value) => `KSh ${value.toLocaleString()}`} />
                    <Area type="monotone" dataKey="sales" stroke="#d97706" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-neutral-200/60 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-serif font-bold text-neutral-900 mb-4 uppercase tracking-wider">Item Distribution</h3>
                <div className="h-44 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart legend mapping */}
              <div className="space-y-1.5 font-mono text-[10px]">
                {categoryChartData.map((item, idx) => (
                  <div key={item.name} className="flex justify-between items-center text-neutral-600">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS[idx] }}></span>
                      {item.name}
                    </span>
                    <span className="font-bold">{item.value} units</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENDER CATALOG CRUD TAB */}
      {activeTab === 'catalog' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center bg-neutral-50 px-5 py-4 border border-neutral-200 rounded-2xl">
            <div>
              <h3 className="text-sm font-bold font-serif text-neutral-900">Total Luxury Stock Pieces</h3>
              <p className="text-xs text-neutral-500 mt-1">Add, update or retire high-end items securely.</p>
            </div>
            {!showAddForm && (
              <button
                onClick={() => { resetForm(); setEditingProduct(null); setShowAddForm(true); }}
                className="bg-neutral-900 hover:bg-neutral-800 text-white font-mono uppercase tracking-wider text-[11px] font-bold px-4 py-2.5 rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-amber-500" /> Add New Piece
              </button>
            )}
          </div>

          {/* Form container */}
          {showAddForm && (
            <div className="bg-white border rounded-2xl p-6 relative">
              <h4 className="font-serif font-black text-neutral-900 mb-4">{editingProduct ? "Manage Selected Piece Details" : "Enter New Stock Specifications"}</h4>
              
              <form onSubmit={handleSubmitProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="text-neutral-500 block mb-1">Product Title</label>
                  <input type="text" value={formName} onChange={e => setFormName(e.target.value)} placeholder="e.g. Kakamega Emerald Collier" className="w-full bg-neutral-50 border p-2.5 rounded-lg text-xs" required />
                </div>
                <div>
                  <label className="text-neutral-500 block mb-1">Price (Kenyan Shillings - KSh)</label>
                  <input type="number" value={formPrice} onChange={e => setFormPrice(Number(e.target.value))} className="w-full bg-neutral-50 border p-2.5 rounded-lg text-xs" required />
                </div>
                <div>
                  <label className="text-neutral-500 block mb-1">Category Group</label>
                  <select value={formCategory} onChange={e => setFormCategory(e.target.value as any)} className="w-full bg-neutral-50 border p-2.5 rounded-lg text-xs">
                    <option value="rings">Rings</option>
                    <option value="necklaces">Necklaces</option>
                    <option value="bracelets">Bracelets</option>
                    <option value="earrings">Earrings</option>
                  </select>
                </div>
                <div>
                  <label className="text-neutral-500 block mb-1">Stock Volcanic Count</label>
                  <input type="number" value={formStock} onChange={e => setFormStock(Number(e.target.value))} className="w-full bg-neutral-50 border p-2.5 rounded-lg text-xs" required min="0" />
                </div>
                <div>
                  <label className="text-neutral-500 block mb-1">Solid Metals Base</label>
                  <input type="text" value={formMaterial} onChange={e => setFormMaterial(e.target.value)} className="w-full bg-neutral-50 border p-2.5 rounded-lg text-xs" />
                </div>
                <div>
                  <label className="text-neutral-500 block mb-1">Gemstone Component</label>
                  <input type="text" value={formGemstone} onChange={e => setFormGemstone(e.target.value)} className="w-full bg-neutral-50 border p-2.5 rounded-lg text-xs" />
                </div>
                <div>
                  <label className="text-neutral-500 block mb-1">Certificate Unique ID Reference</label>
                  <input type="text" value={formCertId} onChange={e => setFormCertId(e.target.value)} className="w-full bg-neutral-50 border p-2.5 rounded-lg text-xs" />
                </div>
                <div>
                  <label className="text-neutral-500 block mb-1">Ethical Mine Geographic Sourcing</label>
                  <input type="text" value={formMine} onChange={e => setFormMine(e.target.value)} placeholder="e.g. Tsavo Artisanal Guild, Kenya" className="w-full bg-neutral-50 border p-2.5 rounded-lg text-xs" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-neutral-500 block mb-1">Unsplash Luxury Image Link URL</label>
                  <input type="text" value={formImage} onChange={e => setFormImage(e.target.value)} className="w-full bg-neutral-50 border p-2.5 rounded-lg text-xs" required />
                </div>
                <div className="md:col-span-2">
                  <label className="text-neutral-500 block mb-1">Item Brief description</label>
                  <textarea rows={2} value={formDescription} onChange={e => setFormDescription(e.target.value)} placeholder="Enter details..." className="w-full bg-neutral-50 border p-2.5 rounded-lg text-xs" />
                </div>

                <div className="flex gap-2 pt-2 md:col-span-2">
                  <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white font-mono px-5 py-2.5 rounded-xl font-bold cursor-pointer">
                    {editingProduct ? "Save Changes" : "Create Asset Seal"}
                  </button>
                  <button type="button" onClick={() => { setShowAddForm(false); resetForm(); }} className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-5 py-2.5 rounded-xl">
                    Discard
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Catalog grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(p => (
              <div key={p.id} className="bg-white border text-xs border-neutral-100 p-4 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="relative">
                    <img src={p.image} alt={p.name} className="w-full h-36 object-cover rounded-xl" />
                    <span className="absolute top-2 right-2 bg-black/60 text-white font-mono text-[9px] px-2 py-0.5 rounded uppercase font-bold">
                      {p.id}
                    </span>
                  </div>
                  <h4 className="font-serif font-black text-sm text-neutral-900 mt-3">{p.name}</h4>
                  <p className="text-[11px] text-neutral-400 font-mono mt-0.5">{p.material} • {p.gemstone}</p>
                  
                  {/* LIVE REAL-TIME INVENTORY CONTROLS */}
                  <div className="mt-2 text-amber-700 font-mono font-bold leading-none text-sm flex justify-between items-center bg-stone-50 p-2 rounded-xl border border-stone-100">
                    <span>KSh {p.priceKSh.toLocaleString()}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase tracking-wider text-neutral-400">Stock:</span>
                      <strong className={`font-mono text-xs ${p.stock <= 2 ? 'text-rose-600 font-black' : p.stock <= 5 ? 'text-amber-600' : 'text-neutral-700'}`}>
                        {p.stock !== undefined ? p.stock : 10}
                      </strong>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            const currentStock = p.stock !== undefined ? p.stock : 10;
                            onEditProduct({ ...p, stock: Math.max(0, currentStock - 1) });
                          }}
                          className="w-5 h-5 bg-white border border-stone-200 rounded flex items-center justify-center font-bold hover:bg-stone-100 cursor-pointer text-xs"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const currentStock = p.stock !== undefined ? p.stock : 10;
                            onEditProduct({ ...p, stock: currentStock + 1 });
                          }}
                          className="w-5 h-5 bg-white border border-stone-200 rounded flex items-center justify-center font-bold hover:bg-stone-100 cursor-pointer text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-neutral-50 p-2 rounded mt-2 border border-neutral-200/50 font-mono text-[9px] text-neutral-500 leading-tight">
                    <strong>CERT ID:</strong> {p.certificate.certificateId}<br/>
                    <strong>Ledger Base:</strong> {p.certificate.mintedAddress.substring(0, 16)}...
                  </div>
                </div>

                {/* Operations buttons */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-2 border-t border-neutral-100">
                  <button
                    onClick={() => startEdit(p)}
                    className="bg-neutral-100 hover:bg-amber-100 text-neutral-700 hover:text-amber-900 font-mono py-1.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                  >
                    Edit Spec
                  </button>
                  <button
                    onClick={() => onDeleteProduct(p.id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-800 font-mono py-1.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                  >
                    Retire Asset
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* RENDER ORDERS MONITOR TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-neutral-50 px-5 py-4 border-b border-neutral-200">
              <h3 className="font-serif text-sm font-bold text-neutral-920 text-neutral-800 uppercase tracking-wider">
                Audited Checkout Pipelines
              </h3>
            </div>

            {orders.length === 0 ? (
              <div className="p-8 text-center text-neutral-500 font-mono text-xs">
                No purchases currently found on the Safaricom / Ledger nodes.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-neutral-100 text-neutral-500 font-bold uppercase tracking-wider border-b border-neutral-200 text-[10px]">
                    <tr>
                      <th className="px-5 py-3">Order Ref</th>
                      <th className="px-5 py-3">Client details</th>
                      <th className="px-5 py-3">Total paid</th>
                      <th className="px-5 py-3">Payment</th>
                      <th className="px-5 py-3">Delivery Status</th>
                      <th className="px-5 py-3 text-right">Micro Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-neutral-700">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-neutral-50/50">
                        <td className="px-5 py-4 font-bold text-neutral-900">
                          {order.id}
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-bold text-neutral-800 block">{order.customerName}</span>
                          <span className="text-[10px] text-neutral-400 block">{order.phone}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-amber-800 font-bold">KSh {order.total.toLocaleString()}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2 py-0.5 rounded-[4px] uppercase text-[9px] font-bold ${order.paymentMethod === 'mpesa' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : order.status === 'verified' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex gap-1 justify-end">
                            {order.status === 'placed' && (
                              <button
                                onClick={() => onUpdateOrderStatus(order.id, 'verified')}
                                className="bg-purple-50 hover:bg-purple-100 text-purple-700 text-[10px] px-2 py-1 rounded select-none cursor-pointer"
                              >
                                Certify Block
                              </button>
                            )}
                            {order.status === 'verified' && (
                              <button
                                onClick={() => onUpdateOrderStatus(order.id, 'shipped')}
                                className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] px-2 py-1 rounded select-none cursor-pointer"
                              >
                                Ship Armored
                              </button>
                            )}
                            {order.status === 'shipped' && (
                              <button
                                onClick={() => onUpdateOrderStatus(order.id, 'delivered')}
                                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] px-2 py-1 rounded select-none cursor-pointer"
                              >
                                Confirm Handover
                              </button>
                            )}
                            {order.status === 'delivered' && (
                              <span className="text-emerald-600 font-bold text-[10px] flex items-center gap-0.5">
                                <CheckCircle className="w-3 h-3 text-emerald-600" /> Complete
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RENDER CUSTOMERS TAB */}
      {activeTab === 'customers' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-neutral-50 px-5 py-4 border-b border-neutral-200">
              <h3 className="font-serif text-sm font-bold text-neutral-800 uppercase tracking-wider">
                System Authenticated Accounts
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-neutral-100 text-neutral-500 font-bold uppercase tracking-wider border-b border-neutral-200 text-[10px]">
                  <tr>
                    <th className="px-5 py-3">Customer ID</th>
                    <th className="px-5 py-3">Account Name</th>
                    <th className="px-5 py-3">Authentication Mail</th>
                    <th className="px-5 py-3">Clearance Role</th>
                    <th className="px-5 py-3">Operational Status</th>
                    <th className="px-5 py-3 text-right">Account Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-700">
                  {customers.map(c => (
                    <tr key={c.id} className="hover:bg-neutral-50/50">
                      <td className="px-5 py-4 font-bold">
                        {c.id}
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-bold text-neutral-800 block">{c.name}</span>
                        <span className="text-[10px] text-neutral-400 block">{c.phone}</span>
                      </td>
                      <td className="px-5 py-4">{c.email}</td>
                      <td className="px-5 py-4 font-bold uppercase">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${c.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-neutral-100 text-neutral-800'}`}>
                          {c.role}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${c.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {c.id !== "CUST-002" ? ( // Safeguard the main local user
                          <div className="flex justify-end gap-2 items-center">
                            <button
                              onClick={() => onUpdateCustomerStatus(c.id, c.status === 'active' ? 'suspended' : 'active')}
                              className={`font-mono text-[10px] px-2.5 py-1 rounded transition-colors cursor-pointer ${c.status === 'active' ? 'bg-amber-50 hover:bg-amber-100 text-amber-800' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'}`}
                            >
                              {c.status === 'active' ? 'Suspend' : 'Reactivate'}
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to permanently delete customer account "${c.name}"?`)) {
                                  onDeleteCustomer(c.id);
                                }
                              }}
                              className="bg-red-50 hover:bg-red-100 text-red-650 text-red-600 font-mono text-[10px] px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1"
                              title="Delete customer permanently"
                            >
                              <Trash2 className="w-3 h-3 text-red-600" />
                              Delete
                            </button>
                          </div>
                        ) : (
                          <span className="text-neutral-400 text-[10px]">Immutable</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
