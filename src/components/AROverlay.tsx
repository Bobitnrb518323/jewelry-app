import React, { useRef, useState, useEffect } from 'react';
import { Camera, RotateCcw, Shuffle, ShieldAlert, Check, HelpCircle, Download, RefreshCw, Layers } from 'lucide-react';
import { Product } from '../types';

interface AROverlayProps {
  product: Product;
  onClose: () => void;
}

const SAMPLE_MODELS = {
  rings: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=500", // Hand background
  bracelets: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=500", // Hand/wrist
  necklaces: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=500", // Face & Neckline
  earrings: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=500" // Close up profile
};

export default function AROverlay({ product, onClose }: AROverlayProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const [useCamera, setUseCamera] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  // AR parameters (scale, rotation, offsets X & Y)
  const [scale, setScale] = useState<number>(product.tryOnOffset.scale);
  const [rotation, setRotation] = useState<number>(product.tryOnOffset.rotation);
  const [posX, setPosX] = useState<number>(product.tryOnOffset.xOffset);
  const [posY, setPosY] = useState<number>(product.tryOnOffset.yOffset);
  
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [polaroidPic, setPolaroidPic] = useState<string | null>(null);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);

  // Initialize camera try-on if chosen
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      const media = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" }
      });
      setStream(media);
      if (videoRef.current) {
        videoRef.current.srcObject = media;
      }
      setUseCamera(true);
    } catch (err: any) {
      console.error("Camera access failed", err);
      setCameraError("Camera access was blocked or is unavailable. Switched to high-fidelity reference model sizing.");
      setUseCamera(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setUseCamera(false);
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Handle Dragging coordinates
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - posX, y: e.clientY - posY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosX(e.clientX - dragStart.x);
    setPosY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile/trackpads
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - posX,
        y: e.touches[0].clientY - posY
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPosX(e.touches[0].clientX - dragStart.x);
    setPosY(e.touches[0].clientY - dragStart.y);
  };

  const handleReset = () => {
    setScale(product.tryOnOffset.scale);
    setRotation(product.tryOnOffset.rotation);
    setPosX(product.tryOnOffset.xOffset);
    setPosY(product.tryOnOffset.yOffset);
    setPolaroidPic(null);
  };

  const takeSnapshot = () => {
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 300);

    // Create custom canvas mockup image
    const canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 500;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw background (either reference model or camera representation)
    const baseImg = new Image();
    baseImg.crossOrigin = "anonymous";
    baseImg.src = useCamera 
      ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=500" // default webcam model
      : SAMPLE_MODELS[product.category] || SAMPLE_MODELS.rings;

    baseImg.onload = () => {
      ctx.drawImage(baseImg, 0, 0, 500, 500);

      // Draw the jewelry item overlaying
      const jewelryImg = new Image();
      jewelryImg.crossOrigin = "anonymous";
      jewelryImg.src = product.image;
      jewelryImg.onload = () => {
        ctx.save();
        // Translate to position
        const centerOffset = 250;
        ctx.translate(centerOffset + posX, centerOffset + posY);
        ctx.rotate((rotation * Math.PI) / 180);
        
        // Draw centered
        const width = 180 * scale;
        const height = 180 * scale;
        ctx.drawImage(jewelryImg, -width / 2, -height / 2, width, height);
        ctx.restore();

        // Convert to polaroid preview state
        setPolaroidPic(canvas.toDataURL("image/png"));
      };
    };
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/90 flex items-center justify-center z-50 p-4 backdrop-blur-md">
      <div className="bg-white rounded-2xl overflow-hidden w-full max-w-4xl shadow-2xl flex flex-col md:flex-row relative">
        
        {/* Flash Effect */}
        {isFlashing && (
          <div className="absolute inset-0 bg-white z-55 animate-ping opacity-80 pointer-events-none" />
        )}

        {/* Viewfinder Section */}
        <div className="w-full md:w-3/5 bg-neutral-950 flex flex-col relative items-center justify-center min-h-[350px] md:min-h-[500px]">
          {/* Top Actions */}
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            {!useCamera ? (
              <button 
                onClick={startCamera}
                className="bg-neutral-800/80 hover:bg-neutral-800 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm pointer-events-auto transition-colors"
              >
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                Enable Webcam
              </button>
            ) : (
              <button 
                onClick={stopCamera}
                className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm pointer-events-auto transition-colors"
              >
                <Shuffle className="w-3.5 h-3.5" />
                Use Model Photo
              </button>
            )}
          </div>

          <div className="absolute top-4 right-4 z-10">
            <span className="bg-black/60 px-3 py-1 text-[10px] uppercase tracking-widest text-amber-400 font-mono rounded-full border border-amber-500/30">
              AR Try-On Mode
            </span>
          </div>

          {/* Interactive Work Area */}
          <div 
            ref={containerRef}
            className="relative w-full h-[320px] md:h-[450px] overflow-hidden flex items-center justify-center cursor-move"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
          >
            {/* Live Feed Video */}
            {useCamera ? (
              <video 
                ref={videoRef}
                autoPlay 
                playsInline
                className="w-full h-full object-cover scale-x-[-1]" // mirror effect
              />
            ) : (
              // Luxury Model Background
              <img 
                src={SAMPLE_MODELS[product.category] || SAMPLE_MODELS.rings} 
                alt="Model Avatar" 
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            )}

            {/* Simulated Live Overlay Ring / Jewel */}
            {!polaroidPic && (
              <div
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                className={`absolute select-none pointer-events-auto transition-shadow ${isDragging ? 'cursor-grabbing scale-102 ring-2 ring-amber-500/50 rounded-full' : 'cursor-grab hover:ring-2 hover:ring-amber-400/30 rounded-full'}`}
                style={{
                  transform: `translate(${posX}px, ${posY}px) rotate(${rotation}deg) scale(${scale})`,
                  width: '180px',
                  height: '180px',
                  backgroundImage: `url(${product.image})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }}
              />
            )}

            {/* Generated Polaroid Snapshot Overlaid */}
            {polaroidPic && (
              <div className="absolute inset-0 bg-black/90 p-6 flex flex-col items-center justify-center z-20">
                <div className="bg-white p-3 pb-8 rounded shadow-2xl skew-y-1 transform scale-90 w-72">
                  <img src={polaroidPic} alt="Polaroid look" className="w-full aspect-square object-cover border border-neutral-200" />
                  <div className="mt-4 font-serif text-center text-sm text-neutral-800 tracking-tight">
                    {product.name} Custom Sizing
                    <div className="text-[10px] font-mono mt-1 text-amber-600 uppercase tracking-widest">
                      Ledger ID: {product.certificate.certificateId}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <a 
                    href={polaroidPic} 
                    download={`try-on-${product.id}.png`}
                    className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Save Image
                  </a>
                  <button 
                    onClick={() => setPolaroidPic(null)}
                    className="bg-neutral-800 border border-neutral-700 text-white hover:bg-neutral-700 text-xs px-4 py-2 rounded-lg"
                  >
                    Try On Again
                  </button>
                </div>
              </div>
            )}
            
            {/* Warning Feedback Banner */}
            {cameraError && (
              <div className="absolute bottom-4 left-4 right-4 bg-red-900/90 text-white text-[11px] p-2.5 rounded-lg flex items-center gap-2 border border-red-500/20 backdrop-blur-sm">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                <span>{cameraError}</span>
              </div>
            )}
          </div>

          {/* Quick Guide */}
          <div className="bg-neutral-900 border-t border-neutral-800 w-full p-2.5 flex justify-between items-center text-[11px] text-neutral-400 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {useCamera ? "System Camera Feed Active" : "Reference Sizing Canvas"}
            </span>
            <span className="hidden sm:inline">Drag piece to position on model</span>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="w-full md:w-2/5 p-6 flex flex-col justify-between bg-neutral-50 border-l border-neutral-100">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] tracking-widest text-amber-600 font-mono font-bold uppercase block mb-1">
                  Virtual Try-on Desk
                </span>
                <h3 className="font-serif text-lg text-neutral-900 font-bold leading-tight">{product.name}</h3>
                <p className="text-xs text-neutral-500 mt-1">{product.gemstone} • {product.material}</p>
              </div>
              <button 
                onClick={onClose}
                className="text-neutral-400 hover:text-neutral-700 p-1 bg-white hover:bg-neutral-200 rounded-full transition-colors"
                id="ar-close-btn"
              >
                ✕
              </button>
            </div>

            {/* Placement controls info */}
            <div className="bg-amber-50 rounded-xl p-3 mb-6 border border-amber-500/15">
              <span className="text-[10px] text-amber-800 font-mono font-semibold uppercase block mb-1">Instructions:</span>
              <p className="text-xs leading-relaxed text-neutral-600">
                Align the jewelry by dragging it inside the viewport, or use the micro-tune adjusters below to perfect the perspective scale and fits.
              </p>
            </div>

            {/* Slider Adjusters */}
            <div className="space-y-4">
              {/* Slider Scale */}
              <div>
                <div className="flex justify-between text-xs font-mono text-neutral-700 mb-1">
                  <span>Jewelry Size (Scale)</span>
                  <span className="text-amber-700 font-medium">{Math.round(scale * 100)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0.3" 
                  max="2.5" 
                  step="0.05"
                  value={scale} 
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 bg-neutral-200 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Slider Rotation */}
              <div>
                <div className="flex justify-between text-xs font-mono text-neutral-700 mb-1">
                  <span>Rotate Angle</span>
                  <span className="text-amber-700 font-medium">{rotation}°</span>
                </div>
                <input 
                  type="range" 
                  min="-180" 
                  max="180" 
                  step="5"
                  value={rotation} 
                  onChange={(e) => setRotation(parseInt(e.target.value))}
                  className="w-full accent-amber-500 bg-neutral-200 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Slider X Position */}
              <div>
                <div className="flex justify-between text-xs font-mono text-neutral-700 mb-1">
                  <span>Horizontal Micro-Tune (X)</span>
                  <span className="text-amber-700 font-medium">{posX}px</span>
                </div>
                <input 
                  type="range" 
                  min="-200" 
                  max="200" 
                  step="2"
                  value={posX} 
                  onChange={(e) => setPosX(parseInt(e.target.value))}
                  className="w-full accent-amber-500 bg-neutral-200 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Slider Y Position */}
              <div>
                <div className="flex justify-between text-xs font-mono text-neutral-700 mb-1">
                  <span>Vertical Micro-Tune (Y)</span>
                  <span className="text-amber-700 font-medium">{posY}px</span>
                </div>
                <input 
                  type="range" 
                  min="-200" 
                  max="200" 
                  step="2"
                  value={posY} 
                  onChange={(e) => setPosY(parseInt(e.target.value))}
                  className="w-full accent-amber-500 bg-neutral-200 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <button
              onClick={takeSnapshot}
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-mono uppercase tracking-widest text-xs py-3 rounded-lg flex items-center justify-center gap-2 transition-all font-semibold active:scale-98 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-amber-400" />
              Capture Try-On Photo
            </button>
            <button
              onClick={handleReset}
              className="w-full bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-700 font-mono uppercase tracking-widest text-[10px] py-2 rounded-lg flex items-center justify-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3 text-neutral-400" />
              Reset All Adjustments
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
