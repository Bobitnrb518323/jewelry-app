import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShoppingBag,
  Fingerprint,
  Camera,
  Database,
  Search,
  Star,
  Trash2,
  X,
  ChevronRight,
  Info,
  Menu,
  Grid,
  Filter,
  Check,
  PackageOpen,
  ShoppingBag as CartIcon,
  ShieldCheck,
  BadgeCheck,
  Plus,
  Minus,
  Navigation
} from 'lucide-react';

import { Product, CartItem, Order, Customer, OrderStatus } from './types';
import { INITIAL_PRODUCTS } from './data/initialProducts';
import {
  fetchProducts, upsertProduct, deleteProduct,
  fetchOrders, insertOrder, updateOrderStatus,
  fetchCustomers, upsertCustomer, updateCustomerStatus, deleteCustomer
} from './lib/db';
import AROverlay from './components/AROverlay';
import VerificationDesk from './components/VerificationDesk';
import CheckoutModal from './components/CheckoutModal';
import AdminDesk from './components/AdminDesk';
import TrackOrder from './components/TrackOrder';
import AuthModal from './components/AuthModal';

// Seed Initial Order
const SEED_ORDER: Order = {
  id: "LUX-584910",
  customerName: "Leon Rotich",
  email: "leonrotich98@gmail.com",
  phone: "+254 712 345678",
  address: "Westlands, Nairobi, Kenya",
  items: [
    { productId: "JWL-R02", name: "Tana River Gold Band", priceKSh: 85000, quantity: 1 }
  ],
  subtotal: 85000,
  shipping: 12000,
  vat: 13600,
  total: 110600,
  date: "2026-06-12 17:34:00",
  status: "shipped",
  trackingEvents: [
    { status: 'placed', title: "Order Safely Anchored", description: "Succeeded in Safaricom payment clearance step. Seed block added.", timestamp: "2026-06-12 17:34", completed: true },
    { status: 'verified', title: "Authenticity Certified", description: "Gold assay and geological coordinates matching validated on Ethereum blockchain.", timestamp: "2026-06-12 18:02-05:00", completed: true },
    { status: 'shipped', title: "Handed over to Armored Courier", description: "Securely enroute inside GPS multi-lock armored van to Westlands.", timestamp: "2026-06-13 10:15", completed: true },
    { status: 'delivered', title: "Secure Handover Successful", description: "Biometric and pin confirmation required upon touchdown.", timestamp: "Pending", completed: false }
  ],
  paymentMethod: 'mpesa'
};

// Seed Initial Customers
const SEED_CUSTOMERS: Customer[] = [
  { id: "CUST-001", name: "Amani Mwangi", email: "amani@safaricom.co.ke", phone: "0722000111", role: "customer", status: "active", dateJoined: "2026-01-10" },
  { id: "CUST-002", name: "Leon Rotich", email: "leonrotich98@gmail.com", phone: "+254712345678", role: "customer", status: "active", dateJoined: "2026-06-14" }
];

export default function App() {
  // Master app states
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  
  // Authenticated customer session states
  const [loggedInCustomer, setLoggedInCustomer] = useState<Customer | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  
  // View managers
  const [activeTab, setActiveTab] = useState<'gallery' | 'ar_tryon' | 'verify' | 'tracker' | 'admin'>('gallery');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [tryOnProduct, setTryOnProduct] = useState<Product | null>(null);
  const [activeVerifyId, setActiveVerifyId] = useState<string>('');
  const [activeTrackingId, setActiveTrackingId] = useState<string>('');
  
  // Shopping Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'rings' | 'necklaces' | 'bracelets' | 'earrings'>('all');
  const [sortFilter, setSortFilter] = useState<'rating' | 'priceDesc' | 'priceAsc'>('rating');

  // Role Simulator switch ('customer' | 'admin')
  const [currentUserRole, setCurrentUserRole] = useState<'customer' | 'admin'>('customer');

  // Add Review states
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Load data from Supabase on startup
  useEffect(() => {
    const loadData = async () => {
      // Restore session from localStorage (lightweight, no DB round-trip)
      const rawLoggedIn = localStorage.getItem('luxury_logged_in_customer');
      if (rawLoggedIn) setLoggedInCustomer(JSON.parse(rawLoggedIn));

      // Fetch products — seed with INITIAL_PRODUCTS if table is empty
      const dbProducts = await fetchProducts().catch(() => [] as Product[]);
      if (dbProducts.length > 0) {
        setProducts(dbProducts);
      } else {
        setProducts(INITIAL_PRODUCTS);
        await Promise.all(INITIAL_PRODUCTS.map(p => upsertProduct(p))).catch(console.error);
      }

      // Fetch orders — seed with SEED_ORDER if table is empty
      const dbOrders = await fetchOrders().catch(() => [] as Order[]);
      if (dbOrders.length > 0) {
        setOrders(dbOrders);
      } else {
        setOrders([SEED_ORDER]);
        await insertOrder(SEED_ORDER).catch(console.error);
      }

      // Fetch customers — seed with SEED_CUSTOMERS if table is empty
      const dbCustomers = await fetchCustomers().catch(() => [] as Customer[]);
      if (dbCustomers.length > 0) {
        setCustomers(dbCustomers);
        if (!rawLoggedIn) {
          const leon = dbCustomers.find(c => c.email.toLowerCase() === "leonrotich98@gmail.com");
          if (leon) {
            setLoggedInCustomer(leon);
            localStorage.setItem('luxury_logged_in_customer', JSON.stringify(leon));
          }
        }
      } else {
        setCustomers(SEED_CUSTOMERS);
        await Promise.all(SEED_CUSTOMERS.map(c => upsertCustomer(c))).catch(console.error);
        if (!rawLoggedIn) {
          const leon = SEED_CUSTOMERS.find(c => c.email.toLowerCase() === "leonrotich98@gmail.com");
          if (leon) {
            setLoggedInCustomer(leon);
            localStorage.setItem('luxury_logged_in_customer', JSON.stringify(leon));
          }
        }
      }
    };

    loadData();
  }, []);

  // Sync helpers — update local state and persist to Supabase
  const syncProductsToStorage = async (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
  };

  const syncOrdersToStorage = async (updatedOrders: Order[]) => {
    setOrders(updatedOrders);
  };

  const syncCustomersToStorage = async (updatedCustomers: Customer[]) => {
    setCustomers(updatedCustomers);
  };

  // Cart operations
  const addToCart = (product: Product) => {
    const maxStock = product.stock !== undefined ? product.stock : 10;
    if (maxStock <= 0) {
      alert(`The fine masterpiece "${product.name}" is currently out of stock first class.`);
      return;
    }

    const existingIndex = cart.findIndex(item => item.product.id === product.id);
    if (existingIndex > -1) {
      const updated = [...cart];
      const currentQty = updated[existingIndex].quantity;
      if (currentQty >= maxStock) {
        alert(`Only ${maxStock} unique pieces of "${product.name}" currently reside in our secure high-security vaults.`);
        return;
      }
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    setIsCartOpen(true);
  };

  const updateCartQty = (productId: string, delta: number) => {
    const updated = cart.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        const maxStock = item.product.stock !== undefined ? item.product.stock : 10;
        if (newQty > maxStock) {
          alert(`Only ${maxStock} certified specimen of "${item.product.name}" remain.`);
          return item;
        }
        return { ...item, quantity: newQty < 1 ? 1 : newQty };
      }
      return item;
    });
    setCart(updated);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Cart financial computations (1 USD = 130 KSh equivalent)
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.priceKSh * item.quantity), 0);
  const cartVat = Math.round(cartSubtotal * 0.16); // 16% standard VAT
  const cartShipping = cartSubtotal > 0 ? 12000 : 0; // Armored insured flat transport
  const cartTotal = cartSubtotal + cartVat + cartShipping;

  // Review submission
  const handleAddReview = (e: React.FormEvent, prdId: string) => {
    e.preventDefault();
    const finalReviewerName = loggedInCustomer ? loggedInCustomer.name : reviewName;
    if (!finalReviewerName.trim() || !reviewComment.trim()) return;

    const newPrdList = products.map(p => {
      if (p.id === prdId) {
        const newRev = {
          id: `REV-${Math.floor(1000 + Math.random() * 9000)}`,
          userName: finalReviewerName,
          rating: Number(reviewRating),
          comment: reviewComment,
          date: new Date().toISOString().split('T')[0]
        };
        const updatedReviews = [newRev, ...p.reviews];
        const starsAverage = Number(
          (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1)
        );
        return { ...p, reviews: updatedReviews, stars: starsAverage };
      }
      return p;
    });

    const updatedPrd = newPrdList.find(p => p.id === prdId)!;
    upsertProduct(updatedPrd).catch(console.error);
    syncProductsToStorage(newPrdList);
    setReviewSuccess(true);
    setReviewName('');
    setReviewComment('');
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  // Admin operational handlers
  const handleAdminAddProduct = (newPrd: Product) => {
    const list = [newPrd, ...products];
    upsertProduct(newPrd).catch(console.error);
    syncProductsToStorage(list);
  };

  const handleAdminEditProduct = (editedPrd: Product) => {
    const list = products.map(p => p.id === editedPrd.id ? editedPrd : p);
    upsertProduct(editedPrd).catch(console.error);
    syncProductsToStorage(list);
  };

  const handleAdminDeleteProduct = (id: string) => {
    const list = products.filter(p => p.id !== id);
    deleteProduct(id).catch(console.error);
    syncProductsToStorage(list);
  };

  const handleAdminUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    const list = orders.map(o => {
      if (o.id === orderId) {
        const updatedEvents = o.trackingEvents.map(ev => {
          if (ev.status === status) {
            return { ...ev, completed: true, timestamp: new Date().toLocaleTimeString() };
          }
          const statusOrder: OrderStatus[] = ['placed', 'verified', 'shipped', 'delivered'];
          if (statusOrder.indexOf(ev.status) < statusOrder.indexOf(status)) {
            return { ...ev, completed: true };
          }
          return ev;
        });
        const updated = { ...o, status, trackingEvents: updatedEvents };
        updateOrderStatus(orderId, status, updatedEvents).catch(console.error);
        return updated;
      }
      return o;
    });
    syncOrdersToStorage(list);
  };

  const handleAdminUpdateCustomerStatus = (customerId: string, status: 'active' | 'suspended') => {
    const list = customers.map(c => c.id === customerId ? { ...c, status } : c);
    updateCustomerStatus(customerId, status).catch(console.error);
    syncCustomersToStorage(list);
  };

  const handleAdminDeleteCustomer = (customerId: string) => {
    const list = customers.filter(c => c.id !== customerId);
    deleteCustomer(customerId).catch(console.error);
    syncCustomersToStorage(list);
    if (loggedInCustomer && loggedInCustomer.id === customerId) {
      setLoggedInCustomer(null);
      localStorage.removeItem('luxury_logged_in_customer');
    }
  };

  const handleCustomerLogin = (cust: Customer) => {
    setLoggedInCustomer(cust);
    localStorage.setItem('luxury_logged_in_customer', JSON.stringify(cust));
  };

  const handleCustomerRegister = (cust: Customer) => {
    const list = [...customers, cust];
    upsertCustomer(cust).catch(console.error);
    syncCustomersToStorage(list);
  };

  const handleCompletedCheckout = (completedOrder: Order) => {
    // Add completed order
    const updatedOrders = [completedOrder, ...orders];
    insertOrder(completedOrder).catch(console.error);
    syncOrdersToStorage(updatedOrders);

    // Decrement stock levels
    const updatedProducts = products.map(p => {
      const purchased = completedOrder.items.find(item => item.productId === p.id);
      if (purchased) {
        const currentStock = p.stock !== undefined ? p.stock : 10;
        const updated = { ...p, stock: Math.max(0, currentStock - purchased.quantity) };
        upsertProduct(updated).catch(console.error);
        return updated;
      }
      return p;
    });
    syncProductsToStorage(updatedProducts);

    // Auto-register new customer
    const matchingCustIndex = customers.findIndex(c => c.email.toLowerCase() === completedOrder.email.toLowerCase());
    if (matchingCustIndex === -1) {
      const newCust: Customer = {
        id: `CUST-00${customers.length + 1}`,
        name: completedOrder.customerName,
        email: completedOrder.email,
        phone: completedOrder.phone,
        role: 'customer',
        status: 'active',
        dateJoined: new Date().toISOString().split('T')[0]
      };
      upsertCustomer(newCust).catch(console.error);
      syncCustomersToStorage([...customers, newCust]);
    }

    clearCart();
    setIsCheckoutOpen(false);
    setActiveTrackingId(completedOrder.id);
    setActiveTab('tracker');
  };

  // Match items filtering inside Catalog UI
  const filteredProducts = products
    .filter(p => categoryFilter === 'all' || p.category === categoryFilter)
    .filter(p => {
      const q = searchQuery.toLowerCase().trim();
      return p.name.toLowerCase().includes(q) ||
             p.gemstone.toLowerCase().includes(q) ||
             p.material.toLowerCase().includes(q) ||
             p.id.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortFilter === 'stars') return b.stars - a.stars;
      if (sortFilter === 'priceDesc') return b.priceKSh - a.priceKSh;
      if (sortFilter === 'priceAsc') return a.priceKSh - b.priceKSh;
      return 0;
    });

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col font-sans antialiased text-neutral-800" id="main-frame">
      
      {/* SECURITY BRAND & SIMULATOR CONTROL header */}
      <div className="bg-neutral-900 text-white text-xs py-2 px-4 flex justify-between items-center font-mono border-b border-white/5 select-none">
        <span className="flex items-center gap-2 text-[10px] text-amber-400">
          <BadgeCheck className="w-3.5 h-3.5" /> SECURE DECENTRALIZED PROVENANCE CHAIN ACTIVE • KES/USD
        </span>
        
        {/* Toggle simulation role directly */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-neutral-400">Audience clearance:</span>
          <div className="flex bg-neutral-800 rounded px-1 py-0.5 border border-neutral-700">
            <button
              onClick={() => { setCurrentUserRole('customer'); if (activeTab === 'admin') setActiveTab('gallery'); }}
              className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase transition-all ${currentUserRole === 'customer' ? 'bg-amber-500 text-neutral-950 font-black' : 'text-neutral-400 hover:text-white'}`}
            >
              Client View
            </button>
            <button
              onClick={() => { setCurrentUserRole('admin'); setActiveTab('admin'); }}
              className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase transition-all ${currentUserRole === 'admin' ? 'bg-amber-500 text-neutral-950 font-black' : 'text-neutral-400 hover:text-white'}`}
            >
              Admin Console
            </button>
          </div>
        </div>
      </div>

      {/* LUXURY SYSTEM NAVBAR */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md z-40 border-b border-stone-100 shadow-sm" id="main-header">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo Insignia */}
          <button 
            onClick={() => { setActiveTab('gallery'); setSelectedProduct(null); }}
            className="flex items-center gap-2 text-left shrink-0 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-neutral-950 flex items-center justify-center text-amber-500">
              <Sparkles className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <h1 className="font-serif font-black tracking-widest text-sm uppercase text-neutral-900 leading-none">
                ZAVARIA
              </h1>
              <span className="text-[9px] leading-none text-neutral-400 uppercase tracking-widest block mt-0.5">
                Luxury Blockchain Retail
              </span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-[#5e5854] text-xs font-mono uppercase tracking-wider">
            <button
              onClick={() => { setActiveTab('gallery'); setSelectedProduct(null); }}
              className={`hover:text-amber-700 font-bold transition-colors cursor-pointer ${activeTab==='gallery'?'text-amber-600':''}`}
            >
              Elite Gallery
            </button>
            <button
              onClick={() => { 
                // try on default item
                const prd = products[0] || INITIAL_PRODUCTS[0];
                setTryOnProduct(prd);
              }}
              className="hover:text-amber-700 transition-colors flex items-center gap-1 font-bold cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" /> AR Virtual Sizing
            </button>
            <button
              onClick={() => { setActiveTab('verify'); setActiveVerifyId(''); }}
              className={`hover:text-amber-700 font-bold transition-colors cursor-pointer ${activeTab==='verify'?'text-amber-600':''}`}
            >
              Provenance Ledger
            </button>
            <button
              onClick={() => { setActiveTab('tracker'); setActiveTrackingId(''); }}
              className={`hover:text-amber-700 font-bold transition-colors cursor-pointer ${activeTab==='tracker'?'text-amber-600':''}`}
            >
              Order Tracker
            </button>
            {currentUserRole === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`text-xs text-amber-600 font-black flex items-center gap-1 border border-amber-500/20 px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 transition-colors cursor-pointer ${activeTab==='admin'?'bg-amber-200':''}`}
              >
                <Fingerprint className="w-3.5 h-3.5" /> Admin Portal
              </button>
            )}
          </nav>

          {/* Cart & Profile triggers */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Authenticated Customer Account Status */}
            {loggedInCustomer ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="bg-amber-50 hover:bg-amber-100 p-2 px-3 rounded-xl text-neutral-800 flex items-center gap-2 border border-amber-200/50 relative transition-all cursor-pointer font-mono text-[11px] font-bold"
                  id="client-profile-trigger"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="max-w-[70px] sm:max-w-none truncate">{loggedInCustomer.name}</span>
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200/80 p-4 z-50 text-xs text-left animate-fadeIn">
                    <div className="border-b pb-3 mb-3">
                      <span className="text-[10px] uppercase text-neutral-400 font-mono font-bold block">Authenticated Customer</span>
                      <strong className="text-neutral-900 font-sans block text-sm mt-0.5">{loggedInCustomer.name}</strong>
                      <span className="text-[9px] font-mono text-neutral-500 block mt-0.5">{loggedInCustomer.email}</span>
                      <span className="text-[9px] font-mono text-amber-600 block mt-0.5 font-bold">UID: {loggedInCustomer.id}</span>
                    </div>

                    <div className="space-y-2 mb-3">
                      <span className="text-[10px] uppercase text-neutral-400 font-mono font-bold block">Assigned phone</span>
                      <span className="font-mono text-neutral-700 block">{loggedInCustomer.phone}</span>
                    </div>

                    <div className="space-y-1 bg-stone-50 p-2.5 rounded-xl border border-stone-100 mb-3 text-[11px]">
                      <div className="flex justify-between text-neutral-600">
                        <span>Past Acquisitions:</span>
                        <strong className="text-neutral-950 font-mono">
                          {orders.filter(o => o.email.toLowerCase() === loggedInCustomer.email.toLowerCase()).length} orders
                        </strong>
                      </div>
                      {orders.filter(o => o.email.toLowerCase() === loggedInCustomer.email.toLowerCase()).length > 0 && (
                        <button
                          onClick={() => {
                            const lastOrder = orders.find(o => o.email.toLowerCase() === loggedInCustomer.email.toLowerCase());
                            if (lastOrder) {
                              setActiveTrackingId(lastOrder.id);
                              setActiveTab('tracker');
                            }
                            setShowProfileMenu(false);
                          }}
                          className="text-[10px] text-amber-700 hover:underline font-mono uppercase font-bold text-left block mt-1"
                        >
                          Track Latest Order ↗
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setLoggedInCustomer(null);
                        localStorage.removeItem('luxury_logged_in_customer');
                        setShowProfileMenu(false);
                      }}
                      className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-mono uppercase text-[10px] font-bold py-2 rounded-xl transition-all"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 p-2 px-3 rounded-xl flex items-center gap-1 transition-all cursor-pointer font-mono text-[11px] font-bold"
                id="header-auth-trigger"
              >
                Sign In
              </button>
            )}

            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-neutral-50 hover:bg-neutral-100 p-2.5 rounded-xl text-neutral-805 text-neutral-800 flex items-center gap-1.5 border border-stone-200 relative transition-all cursor-pointer"
              id="header-cart-icon"
            >
              <ShoppingBag className="w-4 h-4 text-neutral-700 stroke-[1.8]" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-600 text-white font-mono text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </button>
            
            {/* Mobile burger toggle menu */}
            <div className="md:hidden">
              <button 
                onClick={() => {
                  // toggle through panels sequentially for easy mobile experience
                  if (activeTab === 'gallery') setActiveTab('verify');
                  else if (activeTab === 'verify') setActiveTab('tracker');
                  else setActiveTab('gallery');
                }}
                className="bg-neutral-900 text-white py-2 px-3 rounded-lg text-[10px] font-mono tracking-wider font-bold"
              >
                Menu
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* EDITORIAL HERO BANNER - Displayed optionally only on main gallery tab */}
      {activeTab === 'gallery' && !selectedProduct && (
        <section className="bg-neutral-950 text-white overflow-hidden relative border-b border-amber-500/10" id="brand-hero">
          <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center relative z-10">
            {/* Title space */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] tracking-widest text-amber-300 font-mono font-bold uppercase">
                  Kenyan Diamond & Rare Mineral Sourcing
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight leading-none text-stone-100 font-black">
                Provenance <br />
                <span className="italic text-amber-500 font-medium">Is Trust.</span>
              </h2>
              <p className="text-neutral-400 text-xs md:text-sm leading-relaxed max-w-md">
                Purchase fine diamonds, Tsavo emeralds, and Rift Valley rubies featuring direct cryptographic mining signatures. Simulate live AR try-on and experience secure deliveries.
              </p>
              
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => {
                    const block = document.getElementById('catalog-anch');
                    if (block) block.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-amber-500 hover:bg-amber-650 text-neutral-950 font-mono uppercase font-bold text-xs px-6 py-3.5 rounded-xl transition-all cursor-pointer"
                >
                  Acquire Luxury Assets
                </button>
                <button
                  onClick={() => { setActiveTab('verify'); }}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-stone-200 font-mono uppercase text-xs px-5 py-3.5 rounded-xl transition-colors cursor-pointer"
                >
                  Verify An Asset Hash
                </button>
              </div>
            </div>

            {/* Graphic visual layout */}
            <div className="relative flex justify-center">
              <div className="relative w-80 h-96 rounded-3xl overflow-hidden border border-white/10 shadow-2xl skew-x-1">
                <img
                  src="https://images.unsplash.com/photo-1624510461623-1d00c4068cc0?auto=format&fit=crop&q=80&w=400"
                  alt="Elite Collar"
                  className="w-full h-full object-cover origin-center hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                
                {/* Embedded certification block badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/80 p-3.5 border border-white/10 backdrop-blur-md rounded-2xl flex items-center gap-3">
                  <Fingerprint className="w-8 h-8 text-amber-400 shrink-0 stroke-[1.5]" />
                  <div className="text-left font-mono">
                    <span className="text-[8px] text-neutral-400 block uppercase font-bold">Ledger Mint Active</span>
                    <span className="text-[10px] text-white font-semibold">Mara Sapphire Collier</span>
                    <span className="text-[8px] text-amber-500 block">CERT-SAP-1299</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sub background graphic noise overlays */}
          <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial-gradient from-amber-500/5 to-transparent pointer-events-none" />
        </section>
      )}

      {/* CENTRAL MODULE ROUTING CONTENT CONTAINER */}
      <main className="flex-grow">
        
        {/* VIEW 1: ELITE GALLERY MARKETPLACE */}
        {activeTab === 'gallery' && (
          <div className="max-w-6xl mx-auto px-4 py-12" id="catalog-anch">
            
            {/* Search, category and sorting bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              {/* Left search */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Identify gemstones, metal pureness..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white text-xs pl-9 pr-4 py-2.5 rounded-xl border border-neutral-250/70 outline-none focus:ring-2 focus:ring-amber-500/20 text-neutral-800"
                />
              </div>

              {/* Categorical tags tabs */}
              <div className="flex gap-1 overflow-x-auto max-w-full pb-1 font-mono text-[11px] uppercase tracking-wider font-bold">
                {[
                  { key: 'all', label: 'All Items' },
                  { key: 'rings', label: 'Rings' },
                  { key: 'necklaces', label: 'Necklaces' },
                  { key: 'bracelets', label: 'Bracelets' },
                  { key: 'earrings', label: 'Earrings' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setCategoryFilter(tab.key as any)}
                    className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${categoryFilter === tab.key ? 'bg-neutral-900 text-white' : 'bg-white hover:bg-neutral-100 text-neutral-500 border border-stone-200'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Sorting filters */}
              <select
                value={sortFilter}
                onChange={(e) => setSortFilter(e.target.value as any)}
                className="bg-white border text-xs font-mono py-2 px-3 rounded-xl outline-none text-neutral-700 cursor-pointer"
              >
                <option value="rating">Rating: Elite Stars First</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="priceAsc">Price: Low to High</option>
              </select>
            </div>

            {/* Products grid columns */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white border rounded-2xl p-8 max-w-lg mx-auto">
                <PackageOpen className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <h3 className="font-serif font-black text-lg text-neutral-900">No Masterpieces Found</h3>
                <p className="text-xs text-neutral-500 mt-2 max-w-sm mx-auto">
                  We could not find items matching <span className="font-mono bg-amber-50 px-1 py-0.5 rounded text-amber-900">"{searchQuery}"</span>. Choose alternative categories or broaden searching fields.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setCategoryFilter('all'); }}
                  className="mt-4 bg-neutral-900 text-white text-[10px] uppercase font-mono tracking-widest px-4 py-2 rounded-lg"
                >
                  Reset Catalog Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
                {filteredProducts.map(p => (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl overflow-hidden border border-stone-200/60 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
                  >
                    <div>
                      {/* Interactive Visual Card Container */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                        />
                        
                        {/* Try-on badge shortcut */}
                        <button
                          onClick={(e) => { e.stopPropagation(); setTryOnProduct(p); }}
                          className="absolute top-3 left-3 bg-neutral-900/80 hover:bg-neutral-900 text-white text-[10px] uppercase tracking-wider font-mono font-bold px-3 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm shadow transition-colors cursor-pointer"
                        >
                          <Camera className="w-3 h-3 text-amber-400" /> AR Try-On
                        </button>

                        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[9px] font-mono select-none px-2 py-0.5 rounded uppercase font-bold">
                          {p.id}
                        </div>
                      </div>

                      {/* Info block */}
                      <div className="p-4 space-y-2">
                        <div className="flex justify-between items-start gap-1">
                          <h3 
                            className="font-serif text-sm font-bold text-neutral-900 hover:text-amber-700 transition-colors cursor-pointer"
                            onClick={() => setSelectedProduct(p)}
                          >
                            {p.name}
                          </h3>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs">
                          <div className="flex text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < Math.floor(p.stars) ? 'fill-amber-400' : 'text-neutral-200'}`}
                              />
                            ))}
                          </div>
                          <span className="font-mono text-[10px] text-neutral-500 font-bold">{p.stars} ({p.reviews.length} reviews)</span>
                        </div>

                        <p className="text-[11px] text-neutral-500 truncate mt-1">
                          {p.gemstone} • {p.material}
                        </p>
                      </div>
                    </div>

                    {/* Pricing footer block with Cart additions */}
                    <div className="p-4 pt-0">
                      <div className="flex justify-between items-center border-t border-stone-100 pt-3.5 mt-2">
                        <div>
                          <span className="text-[10px] font-mono text-neutral-400 leading-none uppercase block">Certified Price</span>
                          <span className="font-mono font-black text-sm text-amber-600 block leading-tight mt-0.5">
                            KSh {p.priceKSh.toLocaleString()}
                          </span>
                        </div>
                        <button
                          onClick={() => addToCart(p)}
                          className="bg-neutral-900 hover:bg-neutral-800 text-white text-[10px] font-mono uppercase tracking-wider px-3.5 py-2 rounded-lg font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                        >
                          Acquire
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* Client trust footer */}
            <div className="bg-white rounded-3xl p-8 border border-neutral-200/50 mt-20 block text-center max-w-4xl mx-auto">
              <h3 className="font-serif text-lg font-bold text-neutral-900 mb-2">Kenya’s Sovereign Luxury Assurance</h3>
              <p className="text-xs text-neutral-500 max-w-xl mx-auto leading-relaxed">
                Zavaria integrates direct APIs from geology and metallurgy registries, enabling immediate verification of gold weight and diamond mining ethics. Settle transactions securely with Kenya’s premium standard M-Pesa protocol.
              </p>
            </div>

          </div>
        )}

        {/* VIEW 2: BLOCKCHAIN INTEGRITY VERIFICATION CLIENT */}
        {activeTab === 'verify' && (
          <VerificationDesk products={products} initialSearchId={activeVerifyId} />
        )}

        {/* VIEW 3: SECURE PROCESS WAYBILL TRACKER */}
        {activeTab === 'tracker' && (
          <TrackOrder orders={orders} initialOrderId={activeTrackingId} />
        )}

        {/* VIEW 4: SYSTEM OPERATIONS DESK (ADMIN PANEL) */}
        {activeTab === 'admin' && currentUserRole === 'admin' && (
          <AdminDesk
            products={products}
            orders={orders}
            customers={customers}
            onAddProduct={handleAdminAddProduct}
            onEditProduct={handleAdminEditProduct}
            onDeleteProduct={handleAdminDeleteProduct}
            onUpdateOrderStatus={handleAdminUpdateOrderStatus}
            onUpdateCustomerStatus={handleAdminUpdateCustomerStatus}
            onDeleteCustomer={handleAdminDeleteCustomer}
          />
        )}

      </main>

      {/* LUXURY RETAIL FOOTER */}
      <footer className="bg-neutral-950 text-neutral-400 border-t border-white/5 py-12 px-4 text-xs font-mono">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h4 className="text-white font-serif font-black tracking-widest text-sm uppercase">ZAVARIA RETAIL</h4>
            <p className="text-[11px] leading-relaxed text-neutral-500 font-sans">
              Decentralised luxury e-commerce. Crafting pure, auditable physical assets integrated with digital ledger tracking.
            </p>
            <p className="text-[10px] text-amber-500">
              © 2026 Zavaria Inc. All rights reserve.
            </p>
          </div>
          
          <div>
            <h4 className="text-white text-[11px] uppercase tracking-wider mb-3">Elite Nodes</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><button onClick={() => { setActiveTab('gallery'); }} className="hover:text-white transition-colors">Asset Showcases</button></li>
              <li><button onClick={() => { setActiveTab('verify'); }} className="hover:text-white transition-colors">On-chain Trace Desk</button></li>
              <li><button onClick={() => { setActiveTab('tracker'); }} className="hover:text-white transition-colors">Insured Courier Track</button></li>
              <li>{currentUserRole==='admin' && <button onClick={() => { setActiveTab('admin'); }} className="hover:text-white transition-colors text-amber-400">Operations Console</button>}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-[11px] uppercase tracking-wider mb-3">Kenyan Offices</h4>
            <p className="text-[11px] leading-relaxed text-neutral-500 font-sans">
              Delta Corner Towers, 7th Floor<br />
              Waiyaki Way, Westlands<br />
              Nairobi, Kenya
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-white text-[11px] uppercase tracking-wider mb-3">Clearance Access</h4>
            <p className="text-[11px] leading-relaxed text-neutral-500 font-sans">
              Switch role clearances at the top of space to explore order tracking or fulfill stock management dashboards.
            </p>
          </div>
        </div>
      </footer>

      {/* MODAL 1: PRODUCT INDIVIDUAL DETAIL DIALOG */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-4xl max-h-[92vh] md:max-h-[85vh] flex flex-col md:flex-row relative">
            
            {/* Close Button */}
            <button
              onClick={() => { setSelectedProduct(null); setReviewSuccess(false); }}
              className="absolute top-4 right-4 bg-black/60 hover:bg-neutral-905 w-8 h-8 rounded-full text-white hover:bg-black flex items-center justify-center transition-colors z-10"
              id="detail-modal-close"
            >
              ✕
            </button>

            {/* Left Image Column */}
            <div className="w-full md:w-1/2 bg-neutral-100 relative">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-64 md:h-full object-cover"
              />
              <div className="absolute bottom-4 left-4">
                <button
                  onClick={() => {
                    setTryOnProduct(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="bg-amber-500 hover:bg-amber-600 border border-amber-600/10 text-neutral-950 font-mono uppercase tracking-wider text-[11px] py-2 px-4 rounded-xl flex items-center gap-1.5 shadow font-bold cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" /> Direct AR Try-On
                </button>
              </div>
            </div>

            {/* Right Scrollable Specs & Reviews Column */}
            <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col justify-between max-h-[50vh] md:max-h-[85vh]">
              <div className="space-y-5">
                
                {/* Heading */}
                <div>
                  <span className="text-[9px] tracking-widest text-amber-600 font-mono font-bold uppercase block mb-1">
                    Certified Asset Reference
                  </span>
                  <h3 className="font-serif text-2xl font-bold tracking-tight text-neutral-900 leading-tight">
                    {selectedProduct.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono bg-neutral-150 text-neutral-600 font-semibold bg-neutral-100 px-2 py-0.5 rounded">
                      ID: {selectedProduct.id}
                    </span>
                    <span className="font-mono text-xs font-black text-amber-600">
                      KSh {selectedProduct.priceKSh.toLocaleString()}
                    </span>
                    {/* VAULT INVENTORY VISUAL INDICATOR */}
                    <span className={`font-mono text-[10px] ml-auto px-2 py-0.5 rounded font-bold uppercase ${selectedProduct.stock <= 2 ? 'bg-rose-50 text-rose-600 border border-rose-200/50 animate-pulse' : 'bg-stone-100 text-stone-700'}`}>
                      {selectedProduct.stock !== undefined && selectedProduct.stock > 0 ? (
                        selectedProduct.stock <= 3 ? `Sovereign Scarcity: Only ${selectedProduct.stock} Left` : `${selectedProduct.stock} In Vault`
                      ) : (
                        "Out of Vault Stock"
                      )}
                    </span>
                  </div>
                </div>

                {/* Sourcing bullet specs */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-neutral-50 p-3.5 rounded-xl border border-neutral-150/50">
                  <div>
                    <span className="text-[10px] text-neutral-400 font-mono block">GEMSTONE</span>
                    <strong className="text-neutral-800 leading-tight block mt-0.5">{selectedProduct.gemstone}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 font-mono block font-bold">MATERIAL BASE</span>
                    <strong className="text-neutral-800 leading-tight block mt-0.5">{selectedProduct.material}</strong>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <span className="text-[10px] text-neutral-400 font-mono block">CARATS SPEC</span>
                    <strong className="text-neutral-800 leading-tight block mt-0.5">
                      {selectedProduct.certificate.weightCarat > 0 ? `${selectedProduct.certificate.weightCarat} cts` : "Solid dome metals"}
                    </strong>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <span className="text-[10px] text-neutral-400 font-mono block">LEDGER REFERENCE</span>
                    <button
                      onClick={() => {
                        setActiveVerifyId(selectedProduct.certificate.certificateId);
                        setActiveTab('verify');
                        setSelectedProduct(null);
                      }}
                      className="text-amber-700 hover:underline leading-tight block mt-0.5 text-left font-mono font-bold uppercase text-[9px]"
                    >
                      {selectedProduct.certificate.certificateId} ↗
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Ethical Provenance Record</span>
                  <p className="text-xs leading-relaxed text-neutral-700">
                    {selectedProduct.description} This piece features raw gold elements audited from {selectedProduct.certificate.minedSource} and registered on-chain on {selectedProduct.certificate.blockchainTimestamp}.
                  </p>
                </div>

                {/* Cart addition buttons */}
                <div>
                  <button
                    onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                    className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-mono uppercase tracking-widest text-xs py-3 rounded-xl font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    Acquire Product Asset
                  </button>
                </div>

                {/* CLIENT REVIEW SECTIONS */}
                <div className="border-t pt-5">
                  <h4 className="font-serif text-sm font-bold text-neutral-900 uppercase tracking-wider mb-3">Client Feedback</h4>
                  {selectedProduct.reviews.length === 0 ? (
                    <p className="text-neutral-400 italic text-xs">No client reviews registered for this certificate.</p>
                  ) : (
                    <div className="space-y-3.5 mb-5 max-h-44 overflow-y-auto pr-1">
                      {selectedProduct.reviews.map(rev => (
                        <div key={rev.id} className="border-b pb-3 text-xs leading-normal">
                          <div className="flex justify-between font-mono text-[10px] text-neutral-400 mb-1">
                            <span className="font-bold text-neutral-750 text-neutral-700">{rev.userName}</span>
                            <span>{rev.date}</span>
                          </div>
                          <div className="flex text-amber-450 text-amber-500 mb-1 leading-none text-[10px]">
                            {Array.from({ length: rev.rating }).map((_, i) => "★").join("")}
                          </div>
                          <p className="text-neutral-600">{rev.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add review form */}
                  <form onSubmit={(e) => handleAddReview(e, selectedProduct.id)} className="bg-neutral-50 rounded-xl p-4 border border-stone-200 mt-4 space-y-2.5 text-xs">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase block">Submit Client Seal Report</span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Your Name..."
                        value={reviewName}
                        onChange={e => setReviewName(e.target.value)}
                        className="bg-white p-2 border rounded text-xs"
                        required
                      />
                      <select
                        value={reviewRating}
                        onChange={e => setReviewRating(Number(e.target.value))}
                        className="bg-white border p-2 rounded text-xs font-mono"
                      >
                        <option value={5}>5 Stars (Flawless)</option>
                        <option value={4}>4 Stars (Exceptional)</option>
                        <option value={3}>3 Stars (Exquisite)</option>
                        <option value={2}>2 Stars (Good)</option>
                        <option value={1}>1 Star (Poor)</option>
                      </select>
                    </div>

                    <textarea
                      placeholder="Comment on the cut, clarity or delivery service..."
                      value={reviewComment}
                      onChange={e => setReviewComment(e.target.value)}
                      rows={2}
                      className="w-full bg-white p-2 border rounded text-xs"
                      required
                    />

                    <div className="flex justify-between items-center">
                      <button
                        type="submit"
                        className="bg-neutral-900 text-white font-mono uppercase text-[9px] px-3.5 py-1.5 rounded-lg font-bold hover:bg-neutral-850 cursor-pointer"
                      >
                        Submit Review
                      </button>
                      {reviewSuccess && (
                        <span className="text-[10px] text-emerald-600 font-mono font-bold">✓ Review registered!</span>
                      )}
                    </div>
                  </form>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* LAUNCH AR TRY-ON MODULE OVERLAY DIALOG */}
      {tryOnProduct && (
        <AROverlay product={tryOnProduct} onClose={() => setTryOnProduct(null)} />
      )}

      {/* MODAL 2: INTERACTIVE SLIDE-OUT SHOPPING CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-end" id="cart-drawer">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-fadeIn relative">
            {/* Header */}
            <div className="p-5 border-b flex justify-between items-center bg-stone-50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-600" />
                <h3 className="font-serif text-base font-bold text-neutral-900">Your Acquisition Cart</h3>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1 rounded-full bg-white border"
              >
                ✕
              </button>
            </div>

            {/* Cart items list */}
            <div className="flex-grow overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 text-neutral-400 font-mono text-xs space-y-3">
                  <CartIcon className="w-12 h-12 text-stone-250 mx-auto stroke-[1]" />
                  <p>Your acquisition cart is currently empty.</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="bg-neutral-900 text-white text-[9px] uppercase tracking-wider px-4 py-2 rounded-lg font-bold"
                  >
                    Browse Showcase
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.product.id} className="flex gap-3 justify-between items-start text-xs border-b pb-4 border-stone-100">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-14 h-14 object-cover rounded-xl border shrink-0"
                    />
                    <div className="flex-grow">
                      <h4 className="font-serif font-bold text-neutral-900 leading-tight">{item.product.name}</h4>
                      <p className="text-[9px] text-neutral-400 font-mono mt-0.5">{item.product.material}</p>
                      
                      {/* Qty selectors */}
                      <div className="flex items-center gap-1.5 mt-2">
                        <button
                          onClick={() => updateCartQty(item.product.id, -1)}
                          className="w-5 h-5 bg-stone-100 rounded flex items-center justify-center font-bold font-mono focus:outline-none hover:bg-stone-200"
                        >
                          -
                        </button>
                        <span className="font-mono text-xs w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQty(item.product.id, 1)}
                          className="w-5 h-5 bg-stone-100 rounded flex items-center justify-center font-bold font-mono focus:outline-none hover:bg-stone-200"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono font-bold text-neutral-900 block">
                        KSh {(item.product.priceKSh * item.quantity).toLocaleString()}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-550 text-red-500 hover:text-red-700 font-mono text-[9px] uppercase tracking-wider block mt-2 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Calculations and checkout action */}
            {cart.length > 0 && (
              <div className="p-5 border-t bg-stone-50 space-y-4">
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-neutral-500">
                    <span>Acquisition Subtotal:</span>
                    <span className="font-bold text-neutral-800">KSh {cartSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>Assuring VAT (16% Kenya):</span>
                    <span className="font-bold text-neutral-800">KSh {cartVat.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span>Armored Transport Courier:</span>
                    <span className="font-bold text-neutral-800">KSh {cartShipping.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-stone-250 pt-3 flex justify-between items-end">
                    <span className="font-serif text-sm font-bold text-neutral-950">Grand total:</span>
                    <div className="text-right">
                      <span className="font-mono text-base font-black text-amber-600 block">
                        KSh {cartTotal.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-neutral-450 text-neutral-400 block leading-none font-bold">
                        ~${Math.round(cartTotal / 130).toLocaleString()} USD
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsCheckoutOpen(true);
                      setIsCartOpen(false);
                    }}
                    className="w-full bg-neutral-90 * hover:bg-neutral-850 bg-neutral-900 text-white font-mono uppercase tracking-widest text-xs py-3.5 rounded-xl font-bold flex items-center justify-center gap-1 hover:bg-neutral-800 cursor-pointer"
                  >
                    Proceed to secure checkout <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* MODAL 3: INVOICE & MULTI-CHANNELS CHECKOUT COMPONENT */}
      {isCheckoutOpen && (
        <CheckoutModal
          cart={cart}
          subtotal={cartSubtotal}
          vat={cartVat}
          shipping={cartShipping}
          total={cartTotal}
          onClose={() => setIsCheckoutOpen(false)}
          onOrderCompleted={handleCompletedCheckout}
          loggedInCustomer={loggedInCustomer}
        />
      )}

      {/* MODAL 4: AUTHENTICATION PORTAL (REGISTER & LOGIN) */}
      {isAuthOpen && (
        <AuthModal
          onClose={() => setIsAuthOpen(false)}
          onLogin={handleCustomerLogin}
          customers={customers}
          onRegister={handleCustomerRegister}
        />
      )}

    </div>
  );
}
