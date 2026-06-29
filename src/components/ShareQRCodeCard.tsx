import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode, Copy, Check, Share2, Landmark, HelpCircle, ArrowRight, Instagram, Facebook, Globe } from 'lucide-react';

interface ShareQRCodeCardProps {
  shareUrl?: string;
}

export default function ShareQRCodeCard({ shareUrl }: ShareQRCodeCardProps) {
  const [activeMode, setActiveMode] = useState<'upi' | 'share'>('upi');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const bankDetails = {
    holder: 'FOOD FOR ALL CHENNAI TRUST',
    accountNumber: '50200051922546',
    ifsc: 'HDFC0009366',
    branch: 'NEW AVADI ROAD',
    type: 'Current Account',
    upiId: '9551412420@hdfc'
  };

  // Determine what URL or UPI URI to encode
  const currentUrl = shareUrl || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? window.location.href : 'http://www.foodforalltrustchennai.org/');
  
  // Format standard UPI string
  const upiUri = `upi://pay?pa=${bankDetails.upiId}&pn=${encodeURIComponent(bankDetails.holder)}&cu=INR`;

  const textToEncode = activeMode === 'upi' ? upiUri : currentUrl;

  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(textToEncode, {
          width: 300,
          margin: 1.5,
          color: {
            dark: '#1a1a1a',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'M',
        });
        setQrDataUrl(url);
      } catch (err) {
        console.error('Error generating QR code:', err);
      }
    };

    generateQR();
  }, [textToEncode]);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Food For All Chennai Trust',
          text: 'Support daily food security, tuition scholarships, elder care, and clothes for kids in Chennai.',
          url: currentUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      copyToClipboard(currentUrl, 'share-link');
      setShowTooltip('link');
      setTimeout(() => setShowTooltip(null), 2000);
    }
  };

  return (
    <div className="p-5 rounded-3xl bg-[#fff1e6] border-2 border-black shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] text-[#1a1a1a] space-y-4">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white border-2 border-black rounded-xl">
            <QrCode className="w-4 h-4 text-[#c2410c]" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider">Share & Support</h4>
            <p className="text-[10px] text-gray-500 font-bold uppercase">Direct Trust Channel</p>
          </div>
        </div>
        <span className="px-2 py-0.5 text-[8px] font-black uppercase tracking-widest bg-yellow-400 border border-black rounded-md">
          Zero Commission
        </span>
      </div>

      {/* QR Code Switcher Tabs */}
      <div className="flex bg-white/80 p-1 rounded-xl border-2 border-black">
        <button
          onClick={() => setActiveMode('upi')}
          className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
            activeMode === 'upi'
              ? 'bg-[#1a1a1a] text-white border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Scan to Pay (UPI)
        </button>
        <button
          onClick={() => setActiveMode('share')}
          className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
            activeMode === 'share'
              ? 'bg-[#1a1a1a] text-white border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Share Website Link
        </button>
      </div>

      {/* QR Code Graphic Frame */}
      <div className="flex flex-col items-center justify-center p-4 bg-white border-2 border-black rounded-2xl shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
        {qrDataUrl ? (
          <div className="relative">
            <img
              src={qrDataUrl}
              alt="Direct trust QR Code"
              referrerPolicy="no-referrer"
              className="w-40 h-40 object-contain rounded-lg border border-black/10"
            />
            {/* Tiny branding badge at center of QR code (visual styling) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white border-2 border-black rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-xs">🍱</span>
            </div>
          </div>
        ) : (
          <div className="w-40 h-40 bg-slate-100 animate-pulse rounded-lg flex items-center justify-center font-bold text-xs text-slate-400">
            Generating QR...
          </div>
        )}

        {/* Dynamic Label for QR */}
        <div className="mt-2 text-center">
          {activeMode === 'upi' ? (
            <div className="space-y-0.5">
              <p className="text-[11px] font-black text-gray-800 uppercase tracking-wide">
                UPI ID: {bankDetails.upiId}
              </p>
              <p className="text-[9px] text-gray-500 font-bold">
                Scan with GPay, PhonePe, Paytm, or BHIM
              </p>
            </div>
          ) : (
            <div className="space-y-0.5">
              <p className="text-[11px] font-black text-gray-800 uppercase tracking-wide truncate max-w-[200px]">
                {currentUrl.replace(/^https?:\/\//, '')}
              </p>
              <p className="text-[9px] text-gray-500 font-bold">
                Scan to open trust portal on mobile
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="flex gap-2">
        {activeMode === 'upi' ? (
          <button
            onClick={() => copyToClipboard(bankDetails.upiId, 'upi')}
            className="flex-1 py-2 rounded-xl bg-white hover:bg-slate-50 text-[10px] font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {copiedField === 'upi' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied UPI ID
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" /> Copy UPI ID
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleNativeShare}
            className="flex-1 py-2 rounded-xl bg-[#c2410c] hover:bg-[#ea580c] text-white text-[10px] font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {showTooltip === 'link' ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" /> Link Copied
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-white" /> Share with Friends
              </>
            )}
          </button>
        )}
      </div>

      {/* Collapsible/Compact Direct Bank Details for NEFT/IMPS transfers */}
      <div className="p-3 bg-white border-2 border-black rounded-xl space-y-2">
        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider border-b border-black/5 pb-1">
          <Landmark className="w-3.5 h-3.5 text-[#c2410c]" />
          <span>Direct Bank Transfer Info</span>
        </div>

        <div className="space-y-1.5 text-[10px]">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-bold uppercase">Account Holder</span>
            <span className="font-black text-[#1a1a1a] text-right">{bankDetails.holder}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-bold uppercase">Account No.</span>
            <button
              onClick={() => copyToClipboard(bankDetails.accountNumber, 'accNo')}
              className="font-mono font-black text-[#1a1a1a] hover:text-[#c2410c] transition-all flex items-center gap-1 cursor-pointer"
              title="Click to Copy"
            >
              <span>{bankDetails.accountNumber}</span>
              {copiedField === 'accNo' ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <Copy className="w-3 h-3 text-gray-400" />
              )}
            </button>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-bold uppercase">IFSC Code</span>
            <button
              onClick={() => copyToClipboard(bankDetails.ifsc, 'ifsc')}
              className="font-mono font-black text-[#1a1a1a] hover:text-[#c2410c] transition-all flex items-center gap-1 cursor-pointer"
              title="Click to Copy"
            >
              <span>{bankDetails.ifsc}</span>
              {copiedField === 'ifsc' ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <Copy className="w-3 h-3 text-gray-400" />
              )}
            </button>
          </div>

          <div className="flex justify-between items-center border-t border-dashed border-black/5 pt-1.5">
            <span className="text-gray-500 font-bold uppercase">Bank Name</span>
            <span className="font-black text-gray-700">HDFC Bank Ltd.</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-bold uppercase">Branch</span>
            <span className="font-black text-gray-700">{bankDetails.branch}</span>
          </div>
        </div>
      </div>

      {/* Official Social Media and Web Profiles */}
      <div className="p-3 bg-white border-2 border-black rounded-xl space-y-2">
        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider border-b border-black/5 pb-1">
          <Globe className="w-3.5 h-3.5 text-[#c2410c]" />
          <span>Connect with Chennai Trust</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 pt-0.5">
          <a
            href="http://www.foodforalltrustchennai.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-1.5 bg-slate-50 hover:bg-slate-100 border border-black rounded-lg text-center transition-all group"
          >
            <Globe className="w-3.5 h-3.5 text-[#c2410c] group-hover:scale-110 transition-transform" />
            <span className="text-[8px] font-black uppercase mt-1">Website</span>
          </a>
          <a
            href="https://www.instagram.com/foodforallchennai?igsh=NWxyNmM0c2QybWF5"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-1.5 bg-slate-50 hover:bg-slate-100 border border-black rounded-lg text-center transition-all group"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-600 group-hover:scale-110 transition-transform" />
            <span className="text-[8px] font-black uppercase mt-1">Instagram</span>
          </a>
          <a
            href="https://www.facebook.com/share/1FGaNzJDNW/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-1.5 bg-slate-50 hover:bg-slate-100 border border-black rounded-lg text-center transition-all group"
          >
            <Facebook className="w-3.5 h-3.5 text-blue-700 group-hover:scale-110 transition-transform" />
            <span className="text-[8px] font-black uppercase mt-1">Facebook</span>
          </a>
        </div>
      </div>
    </div>
  );
}
