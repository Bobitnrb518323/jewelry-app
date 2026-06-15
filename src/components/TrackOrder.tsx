import React, { useState } from 'react';
import { Search, MapPin, ShieldAlert, CheckCircle2, Clipboard, HelpCircle } from 'lucide-react';
import { Order } from '../types';

interface TrackOrderProps {
  orders: Order[];
  initialOrderId?: string;
}

export default function TrackOrder({ orders, initialOrderId = "" }: TrackOrderProps) {
  const [orderQuery, setOrderQuery] = useState(initialOrderId);
  const [searched, setSearched] = useState(!!initialOrderId);
  const [foundOrder, setFoundOrder] = useState<Order | null>(
    initialOrderId ? (orders.find(o => o.id === initialOrderId) || null) : null
  );

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const lookup = orders.find(
      o => o.id.toUpperCase().trim() === orderQuery.toUpperCase().trim()
    );
    setFoundOrder(lookup || null);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4" id="order-tracker">
      <div className="text-center mb-8">
        <span className="text-xs tracking-widest text-amber-600 font-mono font-bold uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-500/10 inline-block mb-3">
          Armored Transits Trace
        </span>
        <h2 className="text-2xl font-serif font-black text-neutral-900 tracking-tight">
          Secure Order Tracking
        </h2>
        <p className="max-w-md mx-auto text-xs text-neutral-550 text-neutral-500 mt-2">
          Verify transit routes, blockchain verification statuses, and biometric delivery schedules at any moment.
        </p>
      </div>

      {/* Tracker search block */}
      <div className="bg-white rounded-2xl p-5 border border-neutral-100 max-w-lg mx-auto shadow-sm mb-8">
        <form onSubmit={handleTrackSubmit} className="flex gap-2.5">
          <input
            type="text"
            placeholder="Enter Order Code (e.g. LUX-158913)..."
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value)}
            className="w-full bg-neutral-50 px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono outline-none focus:ring-2 focus:ring-amber-500/20"
          />
          <button
            type="submit"
            className="bg-neutral-900 hover:bg-neutral-800 text-white font-mono uppercase tracking-wider text-[10px] font-black px-5 py-2.5 rounded-xl block shrink-0 cursor-pointer"
          >
            Track Waybill
          </button>
        </form>

        {/* Demo orders triggers */}
        <div className="mt-3 flex flex-wrap gap-1.5 items-center">
          <span className="text-[10px] text-neutral-400 font-mono">Simulated Orders:</span>
          {orders.slice(0, 2).map(o => (
            <button
              key={o.id}
              onClick={() => { setOrderQuery(o.id); setFoundOrder(o); setSearched(true); }}
              className="bg-neutral-100 px-2 py-0.5 text-[9px] text-neutral-600 rounded hover:bg-amber-100 hover:text-amber-900 font-mono transition-colors"
            >
              {o.id}
            </button>
          ))}
          {orders.length === 0 && (
            <span className="text-[9px] text-amber-700 italic font-mono bg-amber-50 px-2 py-0.5 rounded">
              Seed a checkout first to track!
            </span>
          )}
        </div>
      </div>

      {/* Tracking results timeline layout */}
      {searched && (
        <div className="animate-fadeIn max-w-xl mx-auto">
          {foundOrder ? (
            <div className="bg-white rounded-2xl p-6 border border-neutral-150/60 shadow-lg space-y-6">
              
              {/* Header metrics */}
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <span className="text-[9px] text-neutral-400 font-mono uppercase">Order Code reference</span>
                  <h4 className="text-sm font-bold font-mono text-neutral-900 mt-0.5">{foundOrder.id}</h4>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-neutral-400 font-mono uppercase">Current status</span>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-mono font-bold uppercase block px-2.5 py-0.5 rounded-full mt-1">
                    {foundOrder.status}
                  </span>
                </div>
              </div>

              {/* Delivery Details summary */}
              <div className="bg-neutral-50 p-4 rounded-xl space-y-2 text-xs">
                <div className="flex gap-2 text-neutral-600">
                  <span className="font-mono text-neutral-400 w-24 shrink-0">Recipient:</span>
                  <strong className="text-neutral-800">{foundOrder.customerName}</strong>
                </div>
                <div className="flex gap-2 text-neutral-600">
                  <span className="font-mono text-neutral-400 w-24 shrink-0">Address:</span>
                  <span className="text-neutral-700">{foundOrder.address}</span>
                </div>
                <div className="flex gap-2 text-neutral-600">
                  <span className="font-mono text-neutral-400 w-24 shrink-0">Assigned Transit:</span>
                  <span className="text-amber-700 font-mono font-bold">Securicor Armored Courier (Insured)</span>
                </div>
              </div>

              {/* Timeline list */}
              <div>
                <span className="text-[10px] tracking-widest text-neutral-400 font-mono uppercase block mb-4">
                  Waybill Events Stream
                </span>

                <div className="relative border-l-2 border-neutral-200 ml-3.5 space-y-6 pb-2">
                  {foundOrder.trackingEvents.map((ev, index) => {
                    const isCompleted = ev.completed;
                    const isActive = foundOrder.status === ev.status || 
                                     (foundOrder.status === 'delivered' && ev.status === 'delivered') ||
                                     (foundOrder.status === 'shipped' && ev.status !== 'delivered') ||
                                     (foundOrder.status === 'verified' && (ev.status === 'placed' || ev.status === 'verified'));

                    return (
                      <div key={ev.status} className="relative pl-6">
                        {/* Timeline point node */}
                        <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center transition-all ${isActive ? 'border-amber-500 bg-amber-500 text-white' : 'border-neutral-300'}`}>
                          {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                        </div>

                        <div>
                          <div className="flex justify-between items-center">
                            <h5 className={`text-xs font-bold ${isActive ? 'text-neutral-900 font-serif' : 'text-neutral-400'}`}>
                              {ev.title}
                            </h5>
                            <span className="text-[10px] text-neutral-400 font-mono">{ev.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-neutral-400 mt-1 leading-normal max-w-sm">
                            {ev.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-neutral-50 rounded-2xl p-6 text-center border border-neutral-100">
              <ShieldAlert className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
              <h5 className="font-serif text-sm font-bold text-neutral-900">Waybill Identity Not Confirmed</h5>
              <p className="text-[11px] text-neutral-500 mt-1 max-w-xs mx-auto">
                No secure shipment could be identified with voucher code <span className="font-mono bg-neutral-200 px-1 py-0.5 rounded text-neutral-700">{orderQuery}</span>. Ensure there are no spaces or punctuation errors.
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
