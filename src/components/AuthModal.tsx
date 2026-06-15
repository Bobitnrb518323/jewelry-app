import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Lock, X, Check, ArrowRight, UserPlus, LogIn, Sparkles } from 'lucide-react';
import { Customer } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (customer: Customer) => void;
  customers: Customer[];
  onRegister: (customer: Customer) => void;
}

export default function AuthModal({ onClose, onLogin, customers, onRegister }: AuthModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isRegister) {
      if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
        setError("All fields (except address) are required for registration.");
        return;
      }
      
      const emailExists = customers.some(c => c.email.toLowerCase() === email.toLowerCase().trim());
      if (emailExists) {
        setError("This email address is already registered.");
        return;
      }

      // Create new customer account
      const newCustomer: Customer = {
        id: `CUST-00${customers.length + 1}`,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        role: 'customer',
        status: 'active',
        dateJoined: new Date().toISOString().split('T')[0]
      };

      onRegister(newCustomer);
      setSuccess("Account sealed successfully! Logging you in...");
      setTimeout(() => {
        onLogin(newCustomer);
        onClose();
      }, 1500);

    } else {
      if (!email.trim() || !password.trim()) {
        setError("Please enter your email and password.");
        return;
      }

      // Check existing customers in storage
      const found = customers.find(c => c.email.toLowerCase() === email.toLowerCase().trim());
      if (found) {
        if (found.status === 'suspended') {
          setError("This account has been suspended by the administrator.");
          return;
        }

        setSuccess(`Welcome back, ${found.name}! Authorized.`);
        setTimeout(() => {
          onLogin(found);
          onClose();
        }, 1200);
      } else {
        // Create matching on the fly for ease of use or prompt them to register
        setError("Account not found. Please click 'Register Account' below to join.");
      }
    }
  };

  const loadDemoAccount = (demoId: string) => {
    const found = customers.find(c => c.id === demoId);
    if (found) {
      setSuccess(`Simulator: Authenticating ${found.name}...`);
      setTimeout(() => {
        onLogin(found);
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm" id="auth-modal">
      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-md w-full border border-stone-100 flex flex-col relative animate-fadeIn">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-[#faf9f6]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="font-serif text-lg font-bold text-neutral-900">
              {isRegister ? "Create Luxury Account" : "Access Personal Vault"}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-full bg-white border border-stone-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto max-h-[80vh] space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl font-sans text-xs">
                ⚠️ {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl font-sans text-xs flex items-center gap-1.5">
                <Check className="w-4 h-4 shrink-0 text-emerald-600" /> {success}
              </div>
            )}

            {isRegister && (
              <div>
                <label className="text-[10px] uppercase text-neutral-400 block mb-1">Full Authentic Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="e.g. Leon Rotich"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-stone-50 pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500/10 outline-none text-neutral-800"
                    required={isRegister}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] uppercase text-neutral-400 block mb-1">Invoicing Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                <input
                  type="email"
                  placeholder="e.g. leonrotich98@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-stone-50 pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500/10 outline-none text-neutral-800"
                  required
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="text-[10px] uppercase text-neutral-400 block mb-1">M-Pesa Verified Telephone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="e.g. 0712345678"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-stone-50 pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500/10 outline-none text-neutral-800"
                    required={isRegister}
                  />
                </div>
              </div>
            )}

            {isRegister && (
              <div>
                <label className="text-[10px] uppercase text-neutral-400 block mb-1">Default Delivery Address (Optional)</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="e.g. Westlands, Nairobi, Kenya"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full bg-stone-50 pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500/10 outline-none text-neutral-800"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] uppercase text-neutral-400 block mb-1">Secret PIN / Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-stone-50 pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500/10 outline-none text-neutral-800"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-mono uppercase text-xs font-black tracking-widest py-3 rounded-xl flex items-center justify-center gap-1.5 transition-all mt-4 cursor-pointer"
            >
              {isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              {isRegister ? "REGISTER LUXURY KEY" : "AUTHORISE SECURE ACCESS"}
            </button>
          </form>

          {/* Toggle Register/Login */}
          <div className="border-t border-stone-100 pt-4 text-center">
            <button
              onClick={() => { setIsRegister(!isRegister); setError(''); setSuccess(''); }}
              className="text-amber-700 hover:text-amber-900 text-xs font-mono font-bold uppercase tracking-wider"
            >
              {isRegister ? "Already standard client? Sign In ↗" : "New prestigious customer? Create Account ↗"}
            </button>
          </div>

          {/* Seed demo quick logins */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 mt-2">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-mono mb-2">Simulate Fast Credentials Login:</span>
            <div className="space-y-1.5 flex flex-col">
              {customers.slice(0, 2).map(c => (
                <button
                  key={c.id}
                  onClick={() => loadDemoAccount(c.id)}
                  className="bg-white hover:bg-stone-100 border text-left p-2.5 rounded-lg text-xs flex justify-between items-center transition-colors font-sans"
                >
                  <div className="font-medium text-neutral-850">
                    <div>{c.name} ({c.id})</div>
                    <div className="text-[10px] text-neutral-400 block mt-0.5">{c.email}</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
