
import React from 'react';
import { X, MapPin, Hash, User, ShieldCheck } from 'lucide-react';

interface VolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VolunteerModal: React.FC<VolunteerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl transform transition-all scale-100">
        <div className="relative h-32 bg-emerald-800 flex items-center justify-center">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
            <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-slate-200">
              <img 
                src="https://raw.githubusercontent.com/Anisur-07/Assunnah-Foundation/main/IMG_20250221_112028.png" 
                alt="Volunteer" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        
        <div className="pt-16 pb-8 px-8 text-center">
          <h3 className="text-2xl font-bold text-slate-800 mb-1">মোঃ সাকিবুল ইসলাম সাব্বির</h3>
          <p className="text-emerald-600 font-semibold mb-6 flex items-center justify-center gap-1">
            <ShieldCheck size={16} /> আস-সুন্নাহ ভলান্টিয়ার
          </p>
          
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">প্রকল্প এলাকা</p>
                <p className="text-slate-800 font-semibold">দুর্গাপুর, রাজশাহী</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                <Hash size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">এরিয়া কোড</p>
                <p className="text-slate-800 font-semibold text-lg">২০৪</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700">
                <User size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">পদবী</p>
                <p className="text-slate-800 font-semibold">উপজেলা প্রতিনিধি</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="mt-8 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-200"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};

export default VolunteerModal;
