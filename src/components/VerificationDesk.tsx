import React, { useState } from 'react';
import { Search, CheckCircle, ShieldCheck, Cpu, Anchor, Milestone, FileSpreadsheet, Lock, AlertCircle, Copy, Check } from 'lucide-react';
import { Product } from '../types';

interface VerificationDeskProps {
  products: Product[];
  initialSearchId?: string;
}

export default function VerificationDesk({ products, initialSearchId = "" }: VerificationDeskProps) {
  const [query, setQuery] = useState<string>(initialSearchId);
  const [matchedProduct, setMatchedProduct] = useState<Product | null>(
    initialSearchId ? (products.find(p => p.certificate.certificateId === initialSearchId) || null) : null
  );
  const [searched, setSearched] = useState<boolean>(!!initialSearchId);
  const [copied, setCopied] = useState<boolean>(false);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearched(true);
    const found = products.find(
      p => p.certificate.certificateId.toLowerCase().trim() === query.toLowerCase().trim() ||
           p.certificate.mintedAddress.toLowerCase().trim() === query.toLowerCase().trim() ||
           p.id.toLowerCase().trim() === query.toLowerCase().trim()
    );
    setMatchedProduct(found || null);
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4" id="blockchain-desk">
      {/* Dynamic Header */}
      <div className="text-center mb-10">
        <span className="text-xs tracking-widest text-amber-600 font-mono font-bold uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-500/10 inline-block mb-3">
          On-Chain Authenticity Protocol
        </span>
        <h2 className="text-3xl font-serif text-neutral-900 font-bold tracking-tight">
          Blockchain Ledger Registry
        </h2>
        <p className="max-w-xl mx-auto text-sm text-neutral-500 mt-2">
          Verify pure mine-to-market provenance. Every luxury piece is anchored with unique metadata logs minted permanently on the decentralised Ethereum ledger.
        </p>
      </div>

      {/* Query Search Form */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 max-w-2xl mx-auto mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="w-5 h-5 text-neutral-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Enter Certificate ID (e.g., CERT-ETH-9104) or Mint Address..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-neutral-50 text-neutral-800 text-sm pl-11 pr-4 py-3.5 rounded-xl border border-neutral-200 outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
            />
          </div>
          <button
            type="submit"
            className="bg-neutral-900 hover:bg-neutral-800 text-white font-mono uppercase tracking-wider text-xs px-6 py-3.5 rounded-xl font-bold transition-all shrink-0 active:scale-98 cursor-pointer"
          >
            Query Ledger
          </button>
        </form>

        {/* Mini Seed Suggestions */}
        <div className="mt-4 flex flex-wrap gap-2 items-center">
          <span className="text-[11px] text-neutral-400 font-mono">Demo Certificates:</span>
          {products.slice(0, 3).map(p => (
            <button
              key={p.id}
              onClick={() => { setQuery(p.certificate.certificateId); setMatchedProduct(p); setSearched(true); }}
              className="bg-neutral-100 hover:bg-amber-100 text-[10px] text-neutral-600 hover:text-amber-900 px-2.5 py-1 rounded font-mono transition-colors"
            >
              {p.certificate.certificateId}
            </button>
          ))}
        </div>
      </div>

      {/* Results Workspace */}
      {searched && (
        <div className="animate-fadeIn">
          {matchedProduct ? (
            <div className="bg-white rounded-3xl overflow-hidden border border-neutral-100 shadow-xl grid md:grid-cols-12">
              
              {/* Left Column - Product Sourcing Snapshot */}
              <div className="md:col-span-5 bg-neutral-950 p-6 md:p-8 flex flex-col justify-between text-white relative">
                {/* Visual Watermark */}
                <div className="absolute right-0 top-0 opacity-5 pointer-events-none transform -translate-y-12">
                  <ShieldCheck className="w-64 h-64" fill="white" />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-bold">
                      Ledger Active • Confirmed
                    </span>
                  </div>

                  <img
                    src={matchedProduct.image}
                    alt={matchedProduct.name}
                    className="w-full aspect-square object-cover rounded-2xl border border-neutral-800 shadow-xl mb-4"
                  />

                  <h4 className="font-serif text-xl tracking-tight font-bold">{matchedProduct.name}</h4>
                  <p className="text-xs text-neutral-400 mt-1">{matchedProduct.gemstone}</p>
                </div>

                <div className="mt-8 border-t border-neutral-850 pt-4 text-xs font-mono text-neutral-500">
                  <p>Product ID: {matchedProduct.id}</p>
                  <p className="mt-1">Category: {matchedProduct.category.toUpperCase()}</p>
                </div>
              </div>

              {/* Right Column - Premium Authenticity Ledger */}
              <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between">
                <div>
                  {/* Ledger Banner */}
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-6">
                    <div>
                      <span className="text-[10px] tracking-widest text-neutral-400 font-mono uppercase block">
                        Unique Asset Seal
                      </span>
                      <h3 className="text-xl font-serif text-neutral-900 font-bold">
                        Certificate OF Authenticity
                      </h3>
                    </div>
                    <ShieldCheck className="w-10 h-10 text-amber-500 stroke-[1.5]" />
                  </div>

                  {/* Blockchain Technical Specs */}
                  <div className="space-y-4 mb-8">
                    {/* Mint Hash */}
                    <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-200/50">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-neutral-400 font-mono uppercase">
                          Immutable Mint Address
                        </span>
                        <button
                          onClick={() => copyAddress(matchedProduct.certificate.mintedAddress)}
                          className="text-[10px] hover:text-amber-600 font-mono text-neutral-500 flex items-center gap-1 transition-colors"
                        >
                          {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          {copied ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <code className="text-xs font-mono text-neutral-800 break-all select-all">
                        {matchedProduct.certificate.mintedAddress}
                      </code>
                    </div>

                    {/* Meta properties grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border border-neutral-100 rounded-xl p-3.5">
                        <span className="text-[10px] text-neutral-400 font-mono block">CERTS ID ID</span>
                        <span className="text-sm font-semibold text-neutral-900 font-mono block mt-1">
                          {matchedProduct.certificate.certificateId}
                        </span>
                      </div>
                      <div className="border border-neutral-100 rounded-xl p-3.5">
                        <span className="text-[10px] text-neutral-400 font-mono block">BLOCK TIMESTAMP</span>
                        <span className="text-xs text-neutral-800 font-mono block mt-1.5 leading-none">
                          {matchedProduct.certificate.blockchainTimestamp}
                        </span>
                      </div>
                    </div>

                    {/* Sourcing provenance details */}
                    <div className="border border-neutral-100 rounded-xl p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <Anchor className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] font-mono text-neutral-400 uppercase block">Mine Sourcing Origin</span>
                          <span className="text-xs font-semibold text-neutral-800 block mt-0.5">
                            {matchedProduct.certificate.minedSource}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-t border-neutral-100 pt-3">
                        <div>
                          <span className="text-[10px] font-mono text-neutral-400 block">MINERAL PURITY</span>
                          <span className="text-xs font-semibold text-neutral-800 block mt-0.5">
                            {matchedProduct.certificate.mineralPurity}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-neutral-400 block">WEIGHT & FACETING</span>
                          <span className="text-xs font-semibold text-neutral-800 block mt-0.5">
                            {matchedProduct.certificate.weightCarat > 0 ? `${matchedProduct.certificate.weightCarat} Carats` : "N/A Metals"} ({matchedProduct.certificate.cutSpecification})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ethics Audit checklist */}
                  <div className="border-t border-neutral-100 pt-5">
                    <span className="text-[10px] tracking-widest text-neutral-400 font-mono uppercase block mb-3">
                      Ethics & Audit Compliance
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="flex items-center gap-2 text-xs text-neutral-600">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span>Conflict-Free Verified (Kimberley)</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-600">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span>Artisanal Fair-Wage Miners</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-600">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span>Eco-Friendly Refined Minerals</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-600">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span>Carbon-Offset Shipping Seal</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400 font-mono bg-neutral-50 -mx-6 -mb-6 p-4 px-6">
                  <span>Standard ERC-721 Token Protocol</span>
                  <span className="flex items-center gap-1 text-emerald-600 font-bold">
                    <Lock className="w-3 h-3" /> Cryptographically Secure
                  </span>
                </div>

              </div>

            </div>
          ) : (
            // No ledger matches
            <div className="bg-red-50/70 border border-red-100 rounded-2xl p-8 text-center max-w-lg mx-auto">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3 stroke-[1.5]" />
              <h4 className="font-serif text-lg text-neutral-900 font-bold">Registry Verification Failure</h4>
              <p className="text-xs text-neutral-600 mt-2 max-w-sm mx-auto">
                No verified cryptographic asset was found matching <span className="font-mono bg-red-100 text-red-800 px-1 py-0.5 rounded">{query}</span> in the Kenyan Luxury Registry database. Please check transcription errors.
              </p>
              <button
                onClick={() => setQuery("CERT-ETH-9104")}
                className="mt-4 bg-neutral-90 * hover:bg-neutral-800 bg-neutral-900 text-white font-mono text-[10px] uppercase tracking-wider px-4 py-2 rounded-lg"
              >
                Load Sample Certificate
              </button>
            </div>
          )}
        </div>
      )}

      {/* Trust elements cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
        <div className="p-5 bg-white border border-neutral-100 rounded-2xl text-center">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-3">
            <Cpu className="w-5 h-5 text-amber-600" />
          </div>
          <h4 className="text-sm font-bold font-serif text-neutral-900">Decentralised Ledgers</h4>
          <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
            Certificates are minted immediately upon gemstones mining. Ownership can be transferred and traced without human errors.
          </p>
        </div>
        <div className="p-5 bg-white border border-neutral-100 rounded-2xl text-center">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
          </div>
          <h4 className="text-sm font-bold font-serif text-neutral-900">Mines Validation</h4>
          <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
            Our geologists verify coordinates of mining tunnels in Tsavo and Rift Valley belts to guarantee authentic geological certificates.
          </p>
        </div>
        <div className="p-5 bg-white border border-neutral-100 rounded-2xl text-center">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-3">
            <FileSpreadsheet className="w-5 h-5 text-amber-600" />
          </div>
          <h4 className="text-sm font-bold font-serif text-neutral-900">Auditable Reports</h4>
          <p className="text-xs text-neutral-550 mt-1.5 text-neutral-500 leading-relaxed">
            Assaying reports detail specific gemstone cuts, inclusions, and digital signatures generated by accredited gem laboratories.
          </p>
        </div>
      </div>

    </div>
  );
}
