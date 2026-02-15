
import React, { useState } from 'react';
import { Moon, Star, MapPin, Building2, User, ChevronRight } from 'lucide-react';
import VolunteerModal from './VolunteerModal.tsx';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-['Hind_Siliguri']">
      <VolunteerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Decorative Top Bar */}
      <div className="bg-emerald-900 text-white py-1.5 px-4 text-center text-sm flex justify-center items-center gap-4 no-print">
        <span className="flex items-center gap-1 opacity-90 font-light">
          <Star size={12} className="text-yellow-400 fill-current" /> 
          বিসমিল্লাহির রহমানির রাহিম
        </span>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm border-b-4 border-emerald-600 relative z-10">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="bg-emerald-600 p-3.5 rounded-2xl text-white shadow-lg shadow-emerald-200 no-print">
              <Moon size={32} className="fill-current" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-black text-emerald-900 leading-tight tracking-tight">
                আস-সুন্নাহ ফাউন্ডেশন
              </h1>
              <p className="text-emerald-700 font-bold text-xl md:text-2xl mt-1">
                ইফতার বিতরণ প্রকল্প - ২০২৬
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end text-center md:text-right">
            <div className="flex items-center gap-2 text-slate-800 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 shadow-sm">
              <Building2 size={18} className="text-emerald-600" />
              <span className="font-bold text-lg">দুর্গাপুর উপজেলা পরিষদ</span>
            </div>
            <div className="text-slate-500 font-semibold mt-2 text-sm uppercase tracking-widest">
              জেলাঃ রাজশাহী
            </div>
          </div>
        </div>
      </header>

      {/* Volunteer Profile Bar */}
      <div className="bg-[#f0fdf4] border-b border-emerald-100 no-print sticky top-0 z-40 backdrop-blur-md bg-white/80">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-emerald-800 bg-white px-3 py-1.5 rounded-full border border-emerald-100 shadow-sm text-sm font-bold">
              <MapPin size={16} className="text-emerald-600" />
              রাজশাহী বিভাগ
            </div>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 group hover:bg-emerald-100/50 p-1 px-3 rounded-full transition-all duration-300 border border-transparent hover:border-emerald-200"
          >
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-slate-500 font-bold uppercase leading-none">স্বেচ্ছাসেবক</p>
              <p className="text-emerald-900 font-bold text-sm">মোঃ সাকিবুল ইসলাম সাব্বির</p>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-emerald-500 overflow-hidden shadow-md group-hover:scale-105 transition-transform">
              <img 
                src="https://raw.githubusercontent.com/Anisur-07/Assunnah-Foundation/main/IMG_20250221_112028.png" 
                alt="Representative" 
                className="w-full h-full object-cover"
              />
            </div>
            <ChevronRight size={18} className="text-emerald-400 group-hover:text-emerald-600 transform group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 relative">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t-8 border-emerald-800 no-print">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-white text-2xl font-bold mb-6 flex items-center gap-3">
                <div className="bg-emerald-600 p-2 rounded-xl"><Moon size={20} className="fill-current" /></div>
                আস-সুন্নাহ ফাউন্ডেশন
              </h3>
              <p className="text-base leading-relaxed text-slate-400">
                মানুষের সেবায়, মানবতার তরে। আস-সুন্নাহ ফাউন্ডেশন একটি অরাজনৈতিক, অলাভজনক এবং সম্পূর্ণ সেবামূলক প্রতিষ্ঠান। 
              </p>
            </div>
            <div>
              <h4 className="text-white text-lg font-bold mb-6 border-l-4 border-emerald-500 pl-3">প্রকল্পের লক্ষ্য</h4>
              <ul className="text-base space-y-3">
                <li className="flex items-center gap-2 hover:text-emerald-400 transition-colors cursor-default">• অসহায় ও দরিদ্রদের সহায়তা প্রদান</li>
                <li className="flex items-center gap-2 hover:text-emerald-400 transition-colors cursor-default">• পবিত্র রমজানের বরকত ছড়িয়ে দেয়া</li>
                <li className="flex items-center gap-2 hover:text-emerald-400 transition-colors cursor-default">• সাম্য ও ভ্রাতৃত্ব প্রতিষ্ঠা</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-lg font-bold mb-6 border-l-4 border-emerald-500 pl-3">যোগাযোগ</h4>
              <div className="space-y-4">
                <p className="flex items-center gap-3 text-slate-400">
                  <MapPin size={18} className="text-emerald-500" /> দুর্গাপুর, রাজশাহী
                </p>
                <p className="flex items-center gap-3 text-slate-400">
                  <Building2 size={18} className="text-emerald-500" /> উপজেলা পরিষদ ভবন
                </p>
                <div className="pt-2">
                  <p className="text-xs font-bold text-slate-500 uppercase">জরুরী যোগাযোগ</p>
                  <p className="text-xl font-bold text-white">০১৩১৫১০২৪৪৮</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500 font-medium">
            © ২০২৬ আস-সুন্নাহ ফাউন্ডেশন - ইফতার বিতরণ প্রকল্প। সর্বস্বত্ব সংরক্ষিত।
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
