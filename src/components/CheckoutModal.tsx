import React, { useState } from 'react';
import { Smartphone, CreditCard, ChevronRight, Lock, CheckCircle2, ShieldCheck, Truck, Percent, Phone, User, Mail, MapPin } from 'lucide-react';
import { Product, CartItem, Order, OrderStatus, Customer } from '../types';

interface CheckoutModalProps {
  cart: CartItem[];
  subtotal: number;
  vat: number;
  shipping: number;
  total: number;
  onClose: () => void;
  onOrderCompleted: (order: Order) => void;
  loggedInCustomer?: Customer | null;
}

export default function CheckoutModal({
  cart,
  subtotal,
  vat,
  shipping,
  total,
  onClose,
  onOrderCompleted,
  loggedInCustomer
}: CheckoutModalProps) {
  // Navigation & checkout steps
  const [step, setStep] = useState<'details' | 'payment' | 'processing' | 'success'>('details');
  const [payMethod, setPayMethod] = useState<'mpesa' | 'card'>('mpesa');

  // Details fields - auto prefilled from logged-in client credentials
  const [name, setName] = useState(loggedInCustomer?.name || '');
  const [email, setEmail] = useState(loggedInCustomer?.email || '');
  const [phone, setPhone] = useState(loggedInCustomer?.phone || '');
  const [address, setAddress] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardFocused, setCardFocused] = useState<'front' | 'back'>('front');

  // Mpesa fields
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [mpesaPhoneError, setMpesaPhoneError] = useState('');
  const [showPhonePopup, setShowPhonePopup] = useState(false);
  const [mpesaPin, setMpesaPin] = useState('');
  const [mpesaReceipt, setMpesaReceipt] = useState<string | null>(null);

  // Success data
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Form Validations
  const validateDetails = () => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = "Full name is required.";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errors.email = "Please specify a valid email.";
    if (!phone.trim()) errors.phone = "Phone number is required.";
    if (!address.trim()) errors.address = "Insured delivery address is required.";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const proceedToPayment = () => {
    if (validateDetails()) {
      setMpesaPhone(phone); // seed mpesa phone
      setCardName(name);   // seed cardholder
      setStep('payment');
    }
  };

  // M-Pesa STK Push sequence
  const startMpesaStkPush = () => {
    if (!mpesaPhone.trim() || mpesaPhone.length < 9) {
      setMpesaPhoneError("Enter a valid Kenyan M-Pesa Phone (e.g. 0712345678)");
      return;
    }
    setMpesaPhoneError('');
    setShowPhonePopup(true);
  };

  // Click keypad digit
  const pressPinDigit = (digit: string) => {
    if (mpesaPin.length < 4) {
      setMpesaPin(prev => prev + digit);
    }
  };

  const clearPin = () => {
    setMpesaPin('');
  };

  const executePayment = (methodUsed: 'mpesa' | 'card') => {
    setStep('processing');
    setShowPhonePopup(false);

    // Generate random Kenyan transaction reference e.g., REG9X7BC54
    const mpesaRef = "MPE" + Math.random().toString(36).substring(3, 10).toUpperCase();
    const orderId = "LUX-" + Math.floor(100000 + Math.random() * 900000);

    setTimeout(() => {
      const newOrder: Order = {
        id: orderId,
        customerName: name,
        email,
        phone: phone,
        address,
        items: cart.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          priceKSh: item.product.priceKSh,
          quantity: item.quantity
        })),
        subtotal,
        shipping,
        vat,
        total,
        date: new Date().toLocaleString(),
        status: 'placed',
        paymentMethod: methodUsed,
        trackingEvents: [
          { status: 'placed', title: "Order Safely Anchored", description: "Received by Luxury System. Awaiting blockchain validation.", timestamp: "Just now", completed: true },
          { status: 'verified', title: "Authenticity Certified", description: "Verifying materials provenance on decentralised ledger.", timestamp: "Pending", completed: false },
          { status: 'shipped', title: "Handed over to Armored Courier", description: "Enroute inside multi-lock secure vehicles with GPS tracking.", timestamp: "Pending", completed: false },
          { status: 'delivered', title: "Secure Handover Successful", description: "Dual biometric clearance code matching completed.", timestamp: "Pending", completed: false }
        ]
      };

      setCreatedOrder(newOrder);
      setStep('success');
      onOrderCompleted(newOrder); // Update main App State
    }, 2500);
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm" id="checkout-modal">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden grid md:grid-cols-12 max-h-[92vh] md:max-h-[85vh]">
        
        {/* Left column - Invoice and Order Items Breakdown */}
        <div className="md:col-span-5 bg-neutral-50 p-6 md:p-8 border-r border-neutral-150 flex flex-col justify-between overflow-y-auto">
          <div>
            <h3 className="font-serif text-lg font-bold text-neutral-900 mb-6 border-b border-neutral-250/50 pb-2">
              Purchase Invoice
            </h3>

            {/* Cart summary list */}
            <div className="space-y-4 max-h-[30vh] overflow-y-auto pr-2">
              {cart.map(item => (
                <div key={item.product.id} className="flex gap-3 justify-between items-start text-xs">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded-md border border-neutral-200 shrink-0"
                  />
                  <div className="flex-grow">
                    <h4 className="font-serif font-bold text-neutral-800">{item.product.name}</h4>
                    <span className="text-[10px] text-neutral-400 font-mono">QTY: {item.quantity} • {item.product.material}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-semibold text-neutral-900 block">
                      KSh {(item.product.priceKSh * item.quantity).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      ~${Math.round((item.product.priceKSh * item.quantity)/130).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing calculations */}
          <div className="border-t border-neutral-200 pt-6 mt-6 space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-500">Cart Subtotal</span>
              <span className="font-mono text-neutral-800 font-medium">KSh {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-500 flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-neutral-400" /> Kenyan VAT (16%)
              </span>
              <span className="font-mono text-neutral-800">KSh {vat.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-500 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-neutral-400" /> Armored Courier Insured Plan
              </span>
              <span className="font-mono text-neutral-800">KSh {shipping.toLocaleString()}</span>
            </div>
            
            <div className="border-t border-neutral-250/60 pt-4 flex justify-between items-end">
              <span className="font-serif text-sm font-bold text-neutral-900">Aggregate Total</span>
              <div className="text-right">
                <span className="font-mono text-lg font-bold text-amber-600 block">
                  KSh {total.toLocaleString()}
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  ~${Math.round(total / 130).toLocaleString()} USD
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Steps workflow (details, pay method selection, success overlays) */}
        <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[60vh] md:max-h-full">
          
          {/* Step 1: DETAILS */}
          {step === 'details' && (
            <div className="space-y-5">
              <div>
                <span className="text-[9px] tracking-widest text-amber-600 font-mono font-bold uppercase block mb-1">
                  Secure Delivery Gateway
                </span>
                <h3 className="font-serif text-xl font-bold text-neutral-900 leading-tight">
                  Premium Delivery Records
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  We ship via dual-custody armored vehicles across Kenya. Perfect accuracy ensures insurance clearance.
                </p>
              </div>

              <div className="space-y-3.5">
                {/* Full name */}
                <div>
                  <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">
                    Cardholder / Recipient Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="e.g. Leon Rotich"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full bg-neutral-50 text-neutral-800 text-xs pl-9 pr-3 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-amber-500/20 ${formErrors.name ? 'border-red-400' : 'border-neutral-200'}`}
                    />
                  </div>
                  {formErrors.name && <p className="text-[10px] text-red-500 mt-1">{formErrors.name}</p>}
                </div>

                {/* Email Address */}
                <div>
                  <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">
                    Email for Ledger Invoicing
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                    <input
                      type="email"
                      placeholder="e.g. leon@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full bg-neutral-50 text-neutral-800 text-xs pl-9 pr-3 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-amber-500/20 ${formErrors.email ? 'border-red-400' : 'border-neutral-200'}`}
                    />
                  </div>
                  {formErrors.email && <p className="text-[10px] text-red-500 mt-1">{formErrors.email}</p>}
                </div>

                {/* Phone & Address Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">
                      Recipient Call Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="e.g. +254 712 345678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`w-full bg-neutral-50 text-neutral-800 text-xs pl-9 pr-3 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-amber-500/20 ${formErrors.phone ? 'border-red-400' : 'border-neutral-200'}`}
                      />
                    </div>
                    {formErrors.phone && <p className="text-[10px] text-red-500 mt-1">{formErrors.phone}</p>}
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">
                      County / Landmark Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="e.g. Westlands, Nairobi"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className={`w-full bg-neutral-50 text-neutral-800 text-xs pl-9 pr-3 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-amber-500/20 ${formErrors.address ? 'border-red-400' : 'border-neutral-200'}`}
                      />
                    </div>
                    {formErrors.address && <p className="text-[10px] text-red-500 mt-1">{formErrors.address}</p>}
                  </div>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex gap-3 pt-6 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/2 bg-white hover:bg-neutral-100 text-neutral-700 font-mono uppercase tracking-wider text-[11px] py-3 rounded-xl border border-neutral-200 transition-colors"
                >
                  Return to Cart
                </button>
                <button
                  type="button"
                  onClick={proceedToPayment}
                  className="w-1/2 bg-neutral-90 * hover:bg-neutral-800 bg-neutral-905 w-full bg-neutral-900 hover:bg-neutral-800 text-white font-mono uppercase tracking-wider text-[11px] py-3 rounded-xl font-bold flex items-center justify-center gap-1 cursor-pointer"
                >
                  Payment Methods <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: CHOOSE & EXECUTE PAYMENT */}
          {step === 'payment' && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] tracking-widest text-amber-600 font-mono font-bold uppercase block mb-1">
                    Multi-Channel Settlement
                  </span>
                  <h3 className="font-serif text-lg font-bold text-neutral-900">
                    Payment Verification
                  </h3>
                </div>
                <button
                  onClick={() => setStep('details')}
                  className="text-xs text-amber-600 font-mono hover:underline"
                >
                  ← Edit Shipping
                </button>
              </div>

              {/* Selector Tabs */}
              <div className="grid grid-cols-2 gap-3 bg-neutral-100 p-1.5 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPayMethod('mpesa')}
                  className={`py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-xs font-mono font-bold transition-all ${payMethod === 'mpesa' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-800'}`}
                >
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  M-Pesa Quick
                </button>
                <button
                  type="button"
                  onClick={() => setPayMethod('card')}
                  className={`py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-xs font-mono font-bold transition-all ${payMethod === 'card' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-800'}`}
                >
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  International Card
                </button>
              </div>

              {/* MPESA METHOD INTERFACE */}
              {payMethod === 'mpesa' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-start gap-3">
                    <div className="p-1.5 bg-emerald-500 text-white rounded-lg font-mono text-[10px] font-bold tracking-tight">MPESA</div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900">Safaricom Sim-STK Technology</h4>
                      <p className="text-[11px] leading-relaxed text-neutral-600 mt-1">
                        Settle instantly in KES. Entering your active phone triggers an official Safaricom pop-up directly on your mobile device for validation.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">
                      M-Pesa Telephone Number
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. 0712345678"
                        value={mpesaPhone}
                        onChange={(e) => setMpesaPhone(e.target.value)}
                        className={`w-full bg-neutral-50 text-neutral-900 font-mono text-sm px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-emerald-500/20 ${mpesaPhoneError ? 'border-red-400' : 'border-neutral-200'}`}
                      />
                      <button
                        type="button"
                        onClick={startMpesaStkPush}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs uppercase tracking-wider px-5 py-3 rounded-xl font-bold transition-transform shrink-0 active:scale-98 cursor-pointer"
                      >
                        Push STK
                      </button>
                    </div>
                    {mpesaPhoneError && <p className="text-[10px] text-red-500 mt-1">{mpesaPhoneError}</p>}
                  </div>
                </div>
              )}

              {/* CREDIT CARD METHOD INTERFACE */}
              {payMethod === 'card' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Glassmorphic Luxury Animated Interactive Card Back/Front */}
                  <div className="flex justify-center my-2">
                    <div className={`relative w-[280px] h-[165px] rounded-2xl transition-all duration-700 preserve-3d shadow-xl bg-gradient-to-tr from-neutral-900 via-neutral-800 to-amber-950 text-white overflow-hidden ${cardFocused === 'back' ? 'rotate-y-180' : ''}`}>
                      
                      {/* CARD FRONT CONTAINER */}
                      <div className="absolute inset-0 p-5 flex flex-col justify-between backface-invisible">
                        <div className="flex justify-between items-start">
                          <span className="text-[11px] tracking-wide font-mono font-bold text-amber-500">LUXE SECURE CARD</span>
                          <ShieldCheck className="w-6 h-6 text-amber-400" />
                        </div>
                        <div className="text-base font-mono tracking-widest text-center py-2">
                          {cardNumber || "•••• •••• •••• ••••"}
                        </div>
                        <div className="flex justify-between items-end">
                          <div>
                            <span className="text-[8px] uppercase tracking-wider text-neutral-400 block">CARDHOLDER</span>
                            <span className="text-[10px] font-mono tracking-widest uppercase block">{cardName || "NAME"}</span>
                          </div>
                          <div>
                            <span className="text-[8px] uppercase tracking-wider text-neutral-400 block">VAL THRU</span>
                            <span className="text-[10px] font-mono block">{cardExpiry || "MM/YY"}</span>
                          </div>
                        </div>
                      </div>

                      {/* CARD BACK CONTAINER */}
                      <div className="absolute inset-0 rounded-2xl bg-neutral-900 flex flex-col justify-between py-5 rotate-y-180 backface-invisible">
                        <div className="w-full h-8 bg-black mt-2" />
                        <div className="px-5 flex items-center justify-end">
                          <div className="bg-white text-neutral-900 text-xs text-right p-1 px-3 font-mono rounded w-32">
                            {cardCvv || "•••"}
                          </div>
                          <span className="text-[8px] text-neutral-400 ml-2">CVV</span>
                        </div>
                        <div className="px-5 text-[8px] text-neutral-400 font-mono flex justify-between items-center">
                          <span>Secure Vault 256</span>
                          <span>Verified by VISA/MC</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Form fields */}
                  <div className="space-y-3 font-mono text-xs">
                    <div>
                      <input
                        type="text"
                        placeholder="Card Number (e.g. 4000 1234 5678 9010)"
                        value={cardNumber}
                        onFocus={() => setCardFocused('front')}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                        className="w-full bg-neutral-50 px-3 py-2.5 rounded-lg border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Expiry (MM/YY)"
                        value={cardExpiry}
                        onFocus={() => setCardFocused('front')}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-neutral-50 px-3 py-2.5 rounded-lg border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                      <input
                        type="password"
                        placeholder="CVV (3 digits)"
                        value={cardCvv}
                        maxLength={3}
                        onFocus={() => setCardFocused('back')}
                        onBlur={() => setCardFocused('front')}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-neutral-50 px-3 py-2.5 rounded-lg border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => executePayment('card')}
                    disabled={!cardNumber || !cardExpiry || !cardCvv}
                    className="w-full bg-neutral-90 * hover:bg-neutral-800 bg-neutral-900 text-white font-mono uppercase text-xs py-3.5 tracking-wider font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Confirm & Settle KSh {total.toLocaleString()}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 3: PROCESSING SPINNER */}
          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center p-12 text-center animate-fadeIn">
              <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-6"></div>
              <h3 className="font-serif text-xl font-bold text-neutral-900 mb-2">Cryptographic Verification</h3>
              <p className="text-xs text-neutral-500 max-w-sm">
                Authenticating ledger registration with Safaricom network API. Generating dual multi-signature credentials keys. Please remain secure.
              </p>
            </div>
          )}

          {/* Step 4: SUCCESS CONGRATULATIONS */}
          {step === 'success' && createdOrder && (
            <div className="flex flex-col justify-between h-full animate-fadeIn">
              <div className="text-center py-6">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4 animate-bounce" />
                <h3 className="font-serif text-2xl font-bold text-neutral-950 mb-1">Payment Authorized!</h3>
                <span className="text-[10px] tracking-widest text-emerald-600 font-mono font-bold uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block mb-4">
                  Ledger Block Completed
                </span>
                
                <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200/50 max-w-md mx-auto text-left space-y-3 text-xs leading-relaxed">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-neutral-400 font-mono">Invoice Reference</span>
                    <strong className="text-neutral-800 font-mono">{createdOrder.id}</strong>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-neutral-400 font-mono">Total Paid</span>
                    <strong className="text-neutral-800 font-mono">KSh {createdOrder.total.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400 font-mono">Armored Courier To:</span>
                    <span className="text-neutral-800 text-right max-w-[200px]">{createdOrder.address}</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-500 mt-6 max-w-xs mx-auto">
                  A copy of your blockchain provenance certificate and tracking details has been sent to <span className="font-semibold">{createdOrder.email}</span>.
                </p>
              </div>

              <div className="pt-6 border-t">
                <button
                  onClick={onClose}
                  className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-mono uppercase tracking-widest font-bold py-3 text-xs rounded-xl transition-all"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* SAFARICOM M-PESA SIMULATION PHONE MODAL POPUP */}
      {showPhonePopup && (
        <div className="fixed inset-0 bg-black/75 z-60 flex items-center justify-center p-4">
          <div className="bg-[#1f2937] text-white w-72 rounded-[40px] px-5 py-6 border-[8px] border-[#374151] shadow-2xl relative animate-scaleUp">
            
            {/* Top Notch of Phone */}
            <div className="w-24 h-4 bg-black absolute top-2 left-1/2 -translate-x-1/2 rounded-full flex items-center justify-center z-10">
              <span className="w-2 h-2 bg-neutral-900 rounded-full" />
            </div>

            {/* Simulated screen components */}
            <div className="text-center mt-3 mb-4">
              <span className="text-[10px] text-green-400 font-bold block mb-1">▲ Safaricom STK Push</span>
              <div className="bg-neutral-800 p-3 rounded-xl border border-neutral-700">
                <p className="text-[11px] leading-tight text-neutral-200">
                  Pay KSh <span className="text-green-400 font-bold font-mono">{total.toLocaleString()}</span> to <span className="font-semibold text-amber-400">LUXURY JEWELRY KENYA</span>?
                </p>
                <div className="mt-3 flex justify-center">
                  <span className="text-base tracking-widest font-mono select-none px-4 py-1.5 bg-neutral-900 text-emerald-400 rounded-lg bold h-8 w-32 text-center border border-neutral-700/50">
                    {mpesaPin.replace(/./g, '•') || "Enter PIN"}
                  </span>
                </div>
              </div>
            </div>

            {/* Simulated Phone Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2 px-2 py-4">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(d => (
                <button
                  key={d}
                  onClick={() => pressPinDigit(d)}
                  className="bg-neutral-800 hover:bg-neutral-750 text-base font-bold font-mono h-11 w-14 rounded-full flex items-center justify-center mx-auto border border-neutral-700/30 cursor-pointer"
                >
                  {d}
                </button>
              ))}
              <button
                onClick={clearPin}
                className="bg-red-900/60 hover:bg-red-900 text-[10px] font-bold font-mono h-11 w-14 rounded-full flex items-center justify-center mx-auto uppercase cursor-pointer"
              >
                Clear
              </button>
              <button
                onClick={() => pressPinDigit('0')}
                className="bg-neutral-800 hover:bg-neutral-750 text-base font-bold font-mono h-11 w-14 rounded-full flex items-center justify-center mx-auto cursor-pointer"
              >
                0
              </button>
              <button
                onClick={() => executePayment('mpesa')}
                disabled={mpesaPin.length < 4}
                className="bg-emerald-600 disabled:opacity-40 text-[10px] font-bold tracking-wider h-11 w-14 rounded-full flex items-center justify-center mx-auto uppercase cursor-pointer"
              >
                Send
              </button>
            </div>

            <div className="text-center mt-2">
              <button
                onClick={() => setShowPhonePopup(false)}
                className="text-neutral-400 hover:text-neutral-200 text-xs font-mono"
              >
                Cancel STK Push
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
